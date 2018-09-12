window.onload = function() {
  var tileSize = 80;
  var tileBackID = 499;
  var numRows = 4;
  var numCols = 5;
  var tileSpacing = 10;
  var localStorageName = "gottaMatchEmAll";
  var highScore;
  var tilesArray = [];
  var valuesArray = [];
  var selectedArray = [];
  var playSound;
  var score;
  var timeLeft;
  var startingTime = 60;
  var tilesLeft;

  var game = new Phaser.Game(500, 500);
  var playGame = function(game) {}
  playGame.prototype = {
    scoreText: null,
    timeText: null,
    soundArray: [],
    create: function() {
      score = 0;
      timeLeft = startingTime;
      this.placeTiles();
      if (playSound) {
        this.soundArray[0] = game.add.audio("select", 1);
        this.soundArray[1] = game.add.audio("right", 1);
        this.soundArray[2] = game.add.audio("wrong", 1);
      }
      var style= {
        font: "32px PokemonHollow Arial",
        fill: "#FDC20E",
        align: "center"
      }
      this.scoreText = game.add.text(5, 5, "Score: " + score, style);
      this.timeText = game.add.text(5, game.height - 5, "Time left: " + timeLeft,
        style);
      this.timeText.anchor.set(0, 1);
      game.time.events.loop(Phaser.Timer.SECOND, this.decreaseTime, this);
    },
    placeTiles: function() {
      tilesLeft = numRows * numCols;

      /* pad the edge of the board around the left and top */
      var leftSpace = (game.width - (numCols * tileSize) - ((numCols - 1) *
        tileSpacing)) / 2;
      var topSpace = (game.height - (numRows * tileSize) - ((numRows - 1) *
        tileSpacing)) / 2;

      /* populate values array with all values needed */
      for (var i = 0; i < 151; i++) {
        valuesArray.push(i);
      }

      /* shuffle values array */
      for (i = 0; i < valuesArray.length; i++) {
        var from = game.rnd.between(0, valuesArray.length-1);
        var to = game.rnd.between(0, valuesArray.length-1);
        var temp = valuesArray[from];
        valuesArray[from] = valuesArray[to];
        valuesArray[to] = temp;
      }

      /* push two copies of each of the first numRows * numCols values */
      for (i = 0; i < numRows * numCols / 2; i++) {
        tilesArray.push(valuesArray[i]);
        tilesArray.push(valuesArray[i]);
      }

      /* shuffle tile Array to create random order */
      for (i = 0; i < numRows * numCols; i++) {
        var from = game.rnd.between(0, tilesArray.length-1);
        var to = game.rnd.between(0, tilesArray.length-1);
        var temp = tilesArray[from];
        tilesArray[from] = tilesArray[to];
        tilesArray[to] = temp;
      }
      console.log("Tile Values: " + tilesArray);

      /* create displayed buttons from the tile array */
      for (i = 0; i < numCols; i++) {
        for (var j = 0; j < numRows; j++) {
          var tile = game.add.button(leftSpace + i * (tileSize + tileSpacing),
            topSpace + j * (tileSize + tileSpacing), "pokemon" /*"tiles"*/,
            this.showTile, this);
          tile.frame = tileBackID;
          tile.value = tilesArray[j * numCols + i];
        }
      }
    },
    showTile: function(target) {
      if (selectedArray.length < 2 && selectedArray.indexOf(target) == -1) {
        if (playSound) {
          this.soundArray[0].play();
        }
        target.frame = target.value;
        selectedArray.push(target);
      }
      if (selectedArray.length == 2) {
        game.time.events.add(Phaser.Timer.SECOND, this.checkTiles, this);
      }
    },
    checkTiles: function() {
      if (selectedArray.length == 2) {
        if (selectedArray[0].value == selectedArray[1].value) {
          if (playSound) {
            this.soundArray[1].play();
          }
          score++;
          timeLeft += 2;
          this.timeText.text = "Time left: " + timeLeft;
          this.scoreText.text = "Score: " + score;
          selectedArray[0].destroy();
          selectedArray[1].destroy();
          tilesLeft -= 2;
          if (tilesLeft == 0) {
            tilesArray.length = 0;
            selectedArray.length = 0;
            this.placeTiles();
          }
        } else {
          if (playSound) {
            this.soundArray[2].play();
          }
          selectedArray[0].frame = tileBackID;
          selectedArray[1].frame = tileBackID;
        }
        selectedArray.length = 0;
      }
    },
    decreaseTime: function() {
      timeLeft--;
      this.timeText.text = "Time left: " + timeLeft;
      if (timeLeft == 0) {
        game.state.start("GameOver");
      }
    }
  }

  var titleScreen = function(game) {}
  titleScreen.prototype = {
    create: function() {
      game.scale.pageAlignHorizontally = true;
      game.scale.pageAlignVertically = true;
      game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
      game.stage.disableVisibilityChange = true;
      var style = {
        font: "48px PokemonSolid Arial",
        fill: "#FDC20E",
        align: "center"
      };
      var text = game.add.text(game.width / 2, game.height / 2 - 100,
        "Gotta Match \n\'Em All", style);
      text.anchor.set(0.5);
      var playButton = game.add.button(game.width / 2 - 100,
        game.height / 2 + 100, "pokemonicons", this.startGame, this);
      playButton.scale.setTo(0.24);
      playButton.anchor.set(0.5);

      var soundButton = game.add.button(game.width / 2 + 100,
        game.height / 2 + 100, "pokemonicons", this.toggleSound, this);
      soundButton.frame = 2;
      soundButton.scale.setTo(0.24);
      soundButton.anchor.set(0.5);
    },
    startGame: function(target) {
      game.state.start("PlayGame");
    },
    toggleSound: function(target) {
      if (target.frame == 2) {
        playSound = true;
        target.frame = 1;
      } else {
        playSound = false;
        target.frame = 2;
      }
    }
  }

  var gameOver = function(game){};
  gameOver.prototype = {
    gameEndPause: null,
    create: function() {
      this.gameEndPause = false;
      highScore = Math.max(score, highScore);
      localStorage.setItem(localStorageName, highScore);
      var style = {
        font: "32px PokemonHollow Arial",
        fill: "#FDC20E",
        align: "center"
      }
      var text = game.add.text(game.width / 2, game.height / 2, "Game Over\n\nYour Score: "
        + score + "\nBest Score: " + highScore + "\n\nTap to restart", style);
      text.anchor.set(0.5);
      game.time.events.add(Phaser.Timer.SECOND * 2, this.gameEnded, this);
      game.input.onDown.add(this.restartGame, this);
    },
    gameEnded: function() {
      this.gameEndPause = true;
    },
    restartGame: function() {
      if (this.gameEndPause) {
        tilesArray.length = 0;
        selectedArray.length = 0;
        game.state.start("TitleScreen");
      }
    }
  }

  var preloadAssets = function(game) {};
  preloadAssets.prototype = {
    preload: function() {
      game.load.spritesheet("pokemon","assets/sprites/all_pokemon_front_sprites.png", tileSize, tileSize);
      game.load.audio("select", ["assets/sounds/select.mp3", "assets/sounds/select.ogg"]);
      game.load.audio("right", ["assets/sounds/right.mp3", "assets/sounds/right.ogg"]);
      game.load.audio("wrong", ["assets/sounds/wrong.mp3", "assets/sounds/wrong.ogg"]);
      game.load.spritesheet("pokemonicons", "assets/sprites/pokemonicons.png", 333, 333);
    },
    create: function() {
      game.stage.backgroundColor = "#2C4399";
      game.state.start("TitleScreen");
    }
  }

  game.state.add("PreloadAssets", preloadAssets);
  game.state.add("TitleScreen", titleScreen);
  game.state.add("PlayGame", playGame);
  game.state.add("GameOver", gameOver);
  highScore = localStorage.getItem(localStorageName) == null ? 0 :
    localStorage.getItem(localStorageName);
  game.state.start("PreloadAssets");
}
