// Game scene
// -------------
// Runs the core gameplay loop
Crafty.scene('Game', function() {
  function drawWall() {
    // Place a tree at every edge square on our grid
    for (var x = 0; x < Game.map_grid.width; x++) {
      for (var y = 0; y < Game.map_grid.height; y++) {
        var at_edge = x === 0 || x === Game.map_grid.width - 1 || y === 0 || y === Game.map_grid.height - 1;

        if (at_edge) {
          // Place a tree entity at the current tile
          Crafty.e('Tree').at(x, y);
          this.occupied[x][y] = true;
        }
      }
    }
  }

  function initGrid() {
    // A 2D array to keep track of all occupied tiles
    this.occupied = new Array(Game.map_grid.width);
    for (var i = 0; i < Game.map_grid.width; i++) {
      this.occupied[i] = new Array(Game.map_grid.height);
      for (var y = 0; y < Game.map_grid.height; y++) {
        this.occupied[i][y] = false;
      }
    }
  }

  initGrid();

  drawWall();

  var mahnStart   = { x: 5, y: 1 },
      laydeeStart = { x: mahnStart.x + 10, y: mahnStart.y };

  window.laydee = Crafty.e('Laydee').at(mahnStart.x + 6, 3);

  _(5).times(function(n) {
    Crafty.e('Mahn').at(mahnStart.x + 1, mahnStart.y - (n * 3));
  });
  _(7).times(function(n) {
    Crafty.e('Mahn').at(mahnStart.x + 2, mahnStart.y - (n * 2 + 1));
  });

  _(5).times(function(n) {
    Crafty.e('Mahn').at(laydeeStart.x + 1, laydeeStart.y - (n * 2 + 1));
  });
  _(4).times(function(n) {
    Crafty.e('Mahn').at(laydeeStart.x + 2, laydeeStart.y - (n * 2 + 1));
  });

  _(5).times(function(n) {
    Crafty.e('Mahn').at(laydeeStart.x + 1, laydeeStart.y - 10 - (n * 2 + 1));
  });
  _(4).times(function(n) {
    Crafty.e('Mahn').at(laydeeStart.x + 2, laydeeStart.y - 10 - (n * 2 + 1));
  });

  window.escalator =     Escalator.create({ x: mahnStart.x, y: mahnStart.y + 25, length: 12 });
  window.escalatorDown = Escalator.create({ x: mahnStart.x + 10, y: mahnStart.y + 25, length: 12, direction: 'down' });

}, function() {
  // Remove our event binding from above so that we don't
  //  end up having multiple redundant event watchers after
  //  multiple restarts of the game
  this.unbind('VillageVisited', this.show_victory);
});


// Victory scene
// -------------
// Tells the player when they've won and lets them start a new game
Crafty.scene('Victory', function() {
  // Display some text in celebration of the victory
  Crafty.e('2D, DOM, Text')
    .text('Victory!')
    .attr({ x: 0, y: Game.height()/2 - 24, w: Game.width() })
    .css($text_css);

  // After a short delay, watch for the player to press a key, then restart
  // the game when a key is pressed
  var delay = true;
  setTimeout(function() { delay = false; }, 5000);
  this.restart_game = Crafty.bind('KeyDown', function() {
    if (!delay) {
      Crafty.scene('Game');
    }
  });
}, function() {
  // Remove our event binding from above so that we don't
  //  end up having multiple redundant event watchers after
  //  multiple restarts of the game
  this.unbind('KeyDown', this.restart_game);
});

// Loading scene
// -------------
// Handles the loading of binary assets such as images and audio files
Crafty.scene('Loading', function(){
  // Draw some text for the player to see in case the file
  //  takes a noticeable amount of time to load
  Crafty.e('2D, DOM, Text')
    .text('Loading; please wait...')
    .attr({ x: 0, y: Game.height()/2 - 24, w: Game.width() })
    .css($text_css);

  Crafty.scene('Game');
});