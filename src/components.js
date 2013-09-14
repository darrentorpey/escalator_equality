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

  setInEscalator: function() {
    // console.log('Now in escalator');
    if (!this.inEscalator) {
      this.inEscalator = true;
      // console.log('laydee._movement', laydee._movement);
      laydee._movement = { x: laydee._movement.x, y: laydee._movement.y + 1 };
    }
  },

  outOfEscalator: function() {
    // console.log('Now out of escalator');
    this.inEscalator = false;
    laydee._movement = { x: laydee._movement.x, y: laydee._movement.y - 1 };
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
    this.color('#C23464');
  }
});

// It's a man, man
Crafty.c('Mahn', {
  init: function() {
    this.requires('PlainColorActor');
    this.color('rgb(20, 185, 140)');
  }
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
      console.log('Escalator [' + this.length + 'x' + this.width + ']');

      _(this.length).times(function(n) {
        var color = (n + this.animShift) % 3 ? '#BBBBBB' : '#DDDDDD';
        this.leftWall.push(Crafty.e('EscalatorWall').at(this.x, this.y - n));
        this.rightWall.push(Crafty.e('EscalatorWall').at(this.x + 1 + this.width, this.y - (n)));
      }, this);

      this.lastTime = new Date().getTime();

      var self = this,
          c_escalator = Crafty.e('Escalator').at(this.x, this.y);

      c_escalator.attr({ x: c_escalator.attr('x'), y: c_escalator.attr('y'), h: this.length * 8, w: (this.width + 2) * 8 });
      c_escalator.initCollide();
      this.c = c_escalator;

      this.c.bind('EnterFrame', function () {
        var animTimePassed = (new Date().getTime()) -  self.lastTime;

        if (animTimePassed > 300) {
          self.lastTime = new Date().getTime();
          if (self.direction === 'down') {
            self.animShift++;
          } else {
            self.animShift--;
          }
        }

        _.each(self.leftWall, function(w, n) {
          var color = (n + self.animShift) % 3 ? '#BBBBBB' : '#DDDDDD';
          w.color(color);
        });
        _.each(self.rightWall, function(w, n) {
          var color = (n + self.animShift) % 3 ? '#BBBBBB' : '#DDDDDD';
          w.color(color);
        });
      });
    },
    prototype: {
      animShift: 0,

      leftWall:  [],
      rightWall: [],

      length: 8,
      width: 2,
      direction: 'up',

      setDirection: function(val) {
        this.direction = val;
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