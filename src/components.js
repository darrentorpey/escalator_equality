directions = {
  'up':   -1,
  'down': 1
};

// The Grid component allows an element to be located
//  on a grid of tiles
Crafty.c('Grid', {
  init: function() {
    this.attr({
      w: Game.map_grid.tile.width,
      h: Game.map_grid.tile.height
    });
  },

  // Locate this entity at the given position on the grid
  // 0, 0 is the bottom-left corner
  at: function(x, y) {
    if (x === undefined && y === undefined) {
      return { x: this.x/Game.map_grid.tile.width, y: this.y/Game.map_grid.tile.height };
    } else {
      this.attr({ x: x * Game.map_grid.tile.width, y: Game.height() - ((y + 1) * Game.map_grid.tile.height) });
      return this;
    }
  }
});

// An "Actor" is an entity that is drawn in 2D on canvas
//  via our logical coordinate grid
Crafty.c('Actor', {
  init: function() {
    this.requires('2D, Canvas, Grid');
  },
});

// An "Actor" is an entity that is drawn in 2D on canvas
//  via our logical coordinate grid
Crafty.c('PlainColorTile', {
  init: function() {
    this.requires('2D, Canvas, Grid, Color');
  },
});

// An "Actor" is an entity that is drawn in 2D on canvas
//  via our logical coordinate grid
Crafty.c('PlainColorActor', {
  init: function() {
    this.requires('PlainColorTile, Actor, Solid');
  },
});

// A Tree is just an Actor with a certain sprite
Crafty.c('Tree', {
  init: function() {
    this.requires('PlainColorActor');
    this.color('rgb(20, 125, 40)');
  },
});
Crafty.c('Competitor', {
  init: function() {
    this.requires('Collision')
      .onHit('Escalator', this.setInEscalator, this.outOfEscalator);

    this.inEscalator = false;
  },

  setInEscalator: function(data) {
    // console.log('Now in escalator');
    if (!this.inEscalator) {
      this.inEscalator = true;
      var thingWeHit = data[0].obj;
      var shift = directions[thingWeHit.direction];
      this.shiftEdBy = shift;
      this._movement = { x: this._movement.x, y: this._movement.y + shift };
    }
  },

  outOfEscalator: function() {
    // console.log('Now out of escalator');
    this.inEscalator = false;
    this._movement = { x: this._movement.x, y: this._movement.y - this.shiftEdBy };
  }
});

// This is the player-controlled character
Crafty.c('PlayerCharacter', {
  init: function() {
    this.requires('PlainColorActor, Fourway, Collision')
      .fourway(2)
      .stopOnSolids()
      .color('rgb(250, 250, 250)');
  },

  // Registers a stop-movement function to be called when
  //  this entity hits an entity with the "Solid" component
  stopOnSolids: function() {
    this.onHit('Solid', this.stopMovement);

    // this.onHit('Escalator', function() {
    //   console.log('Hit an escalator');
    // });

    return this;
  },

  // Stops the movement
  stopMovement: function() {
    this._speed = 0;
    if (this._movement) {
      this.x -= this._movement.x;
      this.y -= this._movement.y;
    }
  }
});

// Hey, it's a lady!
Crafty.c('Laydee', {
  init: function() {
    this.requires('PlayerCharacter, Competitor');
    this.color('#D4376C');
  }
});

// It's a man, man
Crafty.c('Mahn', {
  init: function() {
    this.requires('PlainColorActor, Competitor');
    this._movement = { x: 0, y: -2 };
    this._speed = { x: 3, y: 3 };
    this.color('#387AD6');
    this.bind("EnterFrame", this._enterframe);
  },

  _enterframe: function () {
    if (this._movement.x !== 0) {
      this.x += this._movement.x;
      this.trigger('Moved', { x: this.x - this._movement.x, y: this.y });
    }

    if (this._movement.y !== 0) {
      this.y += this._movement.y;
      this.trigger('Moved', { x: this.x, y: this.y - this._movement.y });
    }
  },
});

(function() {
  Crafty.c('EscalatorWall', {
    init: function() {
      this.requires('PlainColorTile, Solid');
      this.color('#BBBBBB');
    }
  });

  Crafty.c('Escalator', {
    init: function() {
      this.requires('Grid, Animation');
      this.addComponent('Collision');
    },

    initCollide: function() {
      this.collision();
    },
  });

  Escalator = Models.defineSimpleModel('Escalator', {
    init: function() {
      _.defaults(this, {
        leftWall:  [],
        rightWall: [],
        length:    8,
        width:     2,
        direction: 'up'
      });

      console.log('Escalator [' + this.length + 'x' + this.width + '] (' + this.direction + ')');

      _(this.length).times(function(n) {
        var color = (n + this.animShift) % 3 ? '#BBBBBB' : '#DDDDDD';
        this.leftWall.push(Crafty.e('EscalatorWall').at(this.x, this.y - n));
        this.rightWall.push(Crafty.e('EscalatorWall').at(this.x + 1 + this.width, this.y - (n)));
      }, this);

      this.lastTime = new Date().getTime();

      this.animShift = 20;

      var self = this,
          c_escalator = Crafty.e('Escalator').at(this.x, this.y);

      c_escalator.attr({ x: c_escalator.attr('x'), y: c_escalator.attr('y'), h: this.length * 8, w: (this.width + 2) * 8 });
      c_escalator.direction = this.direction;
      c_escalator.initCollide();
      this.c = c_escalator;

      this.c.bind('EnterFrame', function () {
        var animTimePassed = (new Date().getTime()) -  self.lastTime;

        if (animTimePassed > 300) {
          self.lastTime = new Date().getTime();
          if (self.direction === 'down') {
            self.animShift--;
          } else {
            self.animShift++;
          }

          _.each(self.leftWall, function(w, n) {
            var color = (n + self.animShift) % 4 ? '#BBBBBB' : '#DDDDDD';
            w.color(color);
          });

          _.each(self.rightWall, function(w, n) {
            var color = (n + self.animShift) % 4 ? '#BBBBBB' : '#DDDDDD';
            w.color(color);
          });
        }
      });
    },
    prototype: {
      setDirection: function(val) {
        this.direction = val;
        this.c.direction = this.direction;
      },

      toggleDirection: function() {
        if (this.direction === 'up') {
          this.direction = 'down';
        } else {
          this.direction = 'up';
        }
      }
    }
  });
})();
