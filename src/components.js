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
Crafty.c('PlainColorActor', {
  init: function() {
    this.requires('Actor, Solid, Color');
  },
});

// A Tree is just an Actor with a certain sprite
Crafty.c('Tree', {
  init: function() {
    this.requires('PlainColorActor');
    this.color('rgb(20, 125, 40)');
  },
});

// A Bush is just an Actor with a certain sprite
Crafty.c('Bush', {
  init: function() {
    this.requires('PlainColorActor');
    this.color('rgb(20, 185, 40)');
  },
});

// A Rock is just an Actor with a certain sprite
Crafty.c('Rock', {
  init: function() {
    this.requires('PlainColorActor');
    this.color('rgb(200, 200, 200)');
  },
});

// This is the player-controlled character
Crafty.c('PlayerCharacter', {
  init: function() {
    this.requires('PlainColorActor, Fourway, Collision')
      .fourway(2)
      .stopOnSolids()
      .color('rgb(250, 250, 250)')
      .onHit('Village', this.visitVillage);
  },

  // Registers a stop-movement function to be called when
  //  this entity hits an entity with the "Solid" component
  stopOnSolids: function() {
    this.onHit('Solid', this.stopMovement);

    return this;
  },

  // Stops the movement
  stopMovement: function() {
    this._speed = 0;
    if (this._movement) {
      this.x -= this._movement.x;
      this.y -= this._movement.y;
    }
  },

  // Respond to this player visiting a village
  visitVillage: function(data) {
    villlage = data[0].obj;
    villlage.visit();
  }
});

// Hey, it's a lady!
Crafty.c('Laydee', {
  init: function() {
    this.requires('PlayerCharacter');
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
  Escalator = Models.defineSimpleModel('Escalator', {
    length: 4
  });
})();