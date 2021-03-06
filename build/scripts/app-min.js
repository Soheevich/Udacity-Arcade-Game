'use strict';

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

/* eslint-env browser */

/* Resources.js
 * This is simply an image loading utility. It eases the process of loading
 * image files so that they can be used within your game. It also includes
 * a simple "caching" layer so it will reuse cached images if you attempt
 * to load the same image multiple times.
 */
var resources = function IIFE() {
  var resourceCache = {};
  var promises = [];
  var readyCallbacks = [];

  // Creating a new promise to wait until an image is loaded
  var checkImage = function checkImage(url) {
    return new Promise(function (resolve) {
      var img = document.createElement('img');
      img.src = url;
      img.onload = function () {
        return resolve(img);
      };
      // img.onerror = () => resolve(img);
    });
  };

  /* This is our private image loader function, it is
   * called by the public image loader function.
   */
  var promiseLoad = function promiseLoad(url) {
    return (
      /* Once our image has properly loaded, add it to our cache
       * so that we can simply return this image if the developer
       * attempts to load this file in the future.
       */
      checkImage(url).then(function (img) {
        resourceCache[url] = img;
      })
    );
  };

  return {
    /* This is the publicly accessible image loading function. It accepts
     * an array of strings pointing to image files or a string for a single
     * image. It will then call our private image loading function accordingly.
     */
    load: function load() {
      for (var _len = arguments.length, urls = Array(_len), _key = 0; _key < _len; _key++) {
        urls[_key] = arguments[_key];
      }

      /* If the developer passed in an array of images or single image
       * loop through each value and call our image loader on that image file
       * Then push returned promise to the promises array
       */
      urls.forEach(function (url) {
        return promises.push(promiseLoad(url));
      });

      // This function determines if all of the images that have been requested
      // for loading have in fact been properly loaded.
      Promise.all(promises).then(function () {
        readyCallbacks.forEach(function (func) {
          return func();
        });
      });
    },


    /* This is used by developers to grab references to images they know
     * have been previously loaded. If an image is cached, this functions
     * the same as calling load() on that URL.
     */
    get: function get(url) {
      return resourceCache[url];
    },


    /* This function will add a function to the callback stack that is called
     * when all requested images are properly loaded.
     */
    onReady: function onReady(func) {
      readyCallbacks.push(func);
    }
  };
}();

/* eslint-env browser */

// The super class for every moving object
function MovingObject(y, place, objectType) {
  this.y = [280, 320, 360, 400, 440][y];
  this.place = place;
  this.objectType = objectType;

  // Speed depends on the row
  if (y === 1 || y === 4) {
    this.speed = 3;
  } else if (y === 0) {
    this.speed = 1;
  } else {
    this.speed = 1.5;
  }
}

// The main class for all enemies and logs
MovingObject.prototype = {
  // Translate current position of the object, it will be used by objects behind
  savePosition: function savePosition(x) {
    firstPositionsOfObjects[this.objectType] = x;
  },


  // Update the object's position
  update: function update() {
    var firstObjectPosition = firstPositionsOfObjects[this.objectType];
    if (this.place === 'first') {
      this.savePosition(this.x);

      this.x = this.x > 800 ? -50 : this.x + this.speed;
    } else if (this.place === 'second') {
      if (firstObjectPosition > this.x || this.x > 750) {
        this.x = firstObjectPosition - 200;
      } else {
        this.x += this.speed;
      }
    } else if (this.place === 'third') {
      if (firstObjectPosition > this.x || this.x > 750) {
        this.x = firstObjectPosition - 400;
      } else {
        this.x += this.speed;
      }
    }
  },


  // Draw the object on the screen
  render: function render() {
    engine.ctx.drawImage(resources.get(this.sprite), this.x, this.y);
  }
};

// Logs in the water
function Log(y, place, objectType) {
  MovingObject.apply(this, [y, place, objectType]);
  this.y = [40, 80, 120, 160, 200][y];
  this.sprite = 'build/images/log.png';
  this.place = place;

  // Set distance between instances
  if (this.place === 'first') {
    this.x = -50;
  } else if (this.place === 'second') {
    this.x = -100;
  } else if (this.place === 'third') {
    this.x = -150;
  } else if (this.place === 'fourth') {
    this.x = -200;
  }
}

Log.prototype = Object.create(MovingObject.prototype);
Log.prototype.constructor = Log;

// This method keeps distance between instances.
// Every instance counts its position from the first element.
Log.prototype.update = function update(player) {
  var firstObjectPosition = firstPositionsOfObjects[this.objectType];
  if (this.place === 'first') {
    this.savePosition(this.x);

    this.x = this.x > 800 ? -50 : this.x + this.speed;
  } else if (this.place === 'second') {
    if (firstObjectPosition > this.x || this.x > 750) {
      this.x = firstObjectPosition - 50;
    } else {
      this.x += this.speed;
    }
  } else if (this.place === 'third') {
    if (firstObjectPosition > this.x || this.x > 750) {
      this.x = firstObjectPosition - 100;
    } else {
      this.x += this.speed;
    }
  } else if (this.place === 'fourth') {
    if (firstObjectPosition > this.x || this.x > 750) {
      this.x = firstObjectPosition - 150;
    } else {
      this.x += this.speed;
    }
  }

  // If player is on the log, move this player with the log
  if (player && player.x <= 700) {
    player.update(this.speed);
  }
};

// Resets position on a new game.
Log.prototype.reset = function reset() {
  if (this.place === 'first') {
    this.x = -50;
  } else if (this.place === 'second') {
    this.x = -100;
  } else if (this.place === 'third') {
    this.x = -150;
  } else if (this.place === 'fourth') {
    this.x = -200;
  }
};

// Constructor for enemies moving from right to left (opposite direction)
function LogToLeft(y, place, objectType) {
  MovingObject.apply(this, [y, place, objectType]);
  this.y = [40, 80, 120, 160, 200][y];
  this.sprite = 'build/images/log.png';
  this.place = place;

  // Set distance between instances
  if (this.place === 'first') {
    this.x = 750;
  } else if (this.place === 'second') {
    this.x = 800;
  } else if (this.place === 'third') {
    this.x = 850;
  } else if (this.place === 'fourth') {
    this.x = 900;
  } else if (this.place === 'fifth') {
    this.x = 950;
  }
}

LogToLeft.prototype = Object.create(MovingObject.prototype);
LogToLeft.prototype.constructor = LogToLeft;

// This method keeps distance between instances.
// Every instance counts its position from the first element.
LogToLeft.prototype.update = function update(player) {
  var firstObjectPosition = firstPositionsOfObjects[this.objectType];
  // Update the enemy's position, required method for game
  if (this.place === 'first') {
    this.savePosition(this.x);

    this.x = this.x < -50 ? 750 : this.x - this.speed;
  } else if (this.place === 'second') {
    if (firstObjectPosition < this.x || this.x < -50) {
      this.x = firstObjectPosition + 50;
    } else {
      this.x -= this.speed;
    }
  } else if (this.place === 'third') {
    if (firstObjectPosition < this.x || this.x < -50) {
      this.x = firstObjectPosition + 100;
    } else {
      this.x -= this.speed;
    }
  } else if (this.place === 'fourth') {
    if (firstObjectPosition < this.x || this.x < -50) {
      this.x = firstObjectPosition + 150;
    } else {
      this.x -= this.speed;
    }
  } else if (this.place === 'fifth') {
    if (firstObjectPosition < this.x || this.x < -50) {
      this.x = firstObjectPosition + 200;
    } else {
      this.x -= this.speed;
    }
  }

  // If player is on the log, move this player with the log
  if (player && player.x >= 0) {
    player.update(-this.speed);
  }
};

// Resets position on a new game.
LogToLeft.prototype.reset = function reset() {
  if (this.place === 'first') {
    this.x = 750;
  } else if (this.place === 'second') {
    this.x = 800;
  } else if (this.place === 'third') {
    this.x = 850;
  } else if (this.place === 'fourth') {
    this.x = 900;
  } else if (this.place === 'fifth') {
    this.x = 950;
  }
};

// Enemies our player must avoid
function Enemy(y, place, objectType) {
  MovingObject.apply(this, [y, place, objectType]);
  this.sprite = 'build/images/enemy-bug.png';
  this.place = place;

  // Set distance between instances
  if (this.place === 'first') {
    this.x = -50;
  } else if (this.place === 'second') {
    this.x = -250;
    // } else if (this.place === 'third') {
    //   this.x = -450;
  }
}

Enemy.prototype = Object.create(MovingObject.prototype);
Enemy.prototype.constructor = Enemy;

// Resets position on a new game.
Enemy.prototype.reset = function reset() {
  if (this.place === 'first') {
    this.x = -50;
  } else if (this.place === 'second') {
    this.x = -250;
    // } else if (this.place === 'third') {
    //   this.x = -450;
  }
};

// Constructor for enemies moving from right to left (opposite direction)
function EnemyToLeft(y, place, objectType) {
  MovingObject.apply(this, [y, place, objectType]);
  this.sprite = 'build/images/enemy-bug.png';
  this.place = place;

  if (this.place === 'first') {
    this.x = 750;
  } else if (this.place === 'second') {
    this.x = 950;
    // } else if (this.place === 'third') {
    //   this.x = 1150;
  }
}

EnemyToLeft.prototype = Object.create(MovingObject.prototype);
EnemyToLeft.prototype.constructor = EnemyToLeft;

// This method keeps distance between instances.
// Every instance counts its position from the first element.
EnemyToLeft.prototype.update = function update() {
  var firstObjectPosition = firstPositionsOfObjects[this.objectType];
  // Update the enemy's position, required method for game
  if (this.place === 'first') {
    this.savePosition(this.x);

    this.x = this.x < -50 ? 750 : this.x - this.speed;
  } else if (this.place === 'second') {
    if (firstObjectPosition < this.x || this.x < -50) {
      this.x = firstObjectPosition + 200;
    } else {
      this.x -= this.speed;
    }
    // } else if (this.place === 'third') {
    //   if (firstObjectPosition < this.x || this.x < -50) {
    //     this.x = firstObjectPosition + 400;
    //   } else {
    //     this.x -= this.speed;
    //   }
  }
};

// Render new position on the canvas
EnemyToLeft.prototype.render = function render() {
  // this function was taken from
  // https://stackoverflow.com/questions/3129099/how-to-flip-images-horizontally-with-html5
  var img = resources.get(this.sprite);
  var width = img.width;
  var height = img.height;

  engine.ctx.save();
  // Set the origin to the center of the image
  engine.ctx.translate(this.x + width / 2, this.y + height / 2);

  engine.ctx.scale(-1, 1);

  // Draw the image
  engine.ctx.drawImage(img, -width / 2, -height / 2);

  engine.ctx.restore();
};

// Resets position on a new game.
EnemyToLeft.prototype.reset = function reset() {
  if (this.place === 'first') {
    this.x = 750;
  } else if (this.place === 'second') {
    this.x = 950;
    // } else if (this.place === 'third') {
    //   this.x = 1150;
  }
};

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
function Player() {
  this.x = 350;
  this.y = 480;
  this.sprite = 'build/images/char-boy.png';
  this.lives = 3;
  this.scores = 0;
}

Player.prototype = {
  // Changes player's skin
  updateSprite: function updateSprite(name) {
    this.sprite = name;
  },


  // If player is on log, it will move him
  update: function update() {
    var x = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;

    this.x += x;

    if (this.y < 40 || this.y > 200) {
      var remainder = this.x % 50;

      this.x = remainder > 25 ? this.x + (50 - remainder) : this.x - remainder;
    }
  },


  // Draw the player on the screen, required method for game
  render: function render() {
    engine.ctx.drawImage(resources.get(this.sprite), this.x, this.y);
  },


  // Audio
  cardFlipAudio: function cardFlipAudio() {
    var audio = document.querySelector('audio');
    audio.currentTime = 0;
    audio.play();
  },


  // Player movement method
  handleInput: function handleInput(direction) {
    switch (direction) {
      case 'left':
        if (this.x > 0) {
          this.x -= 50;
          this.cardFlipAudio();
        }
        break;
      case 'up':
        if (this.y > 0) {
          this.y -= 40;
          this.cardFlipAudio();
        }
        break;
      case 'right':
        if (this.x < 700) {
          this.x += 50;
          this.cardFlipAudio();
        }
        break;
      case 'down':
        if (this.y < 480) {
          this.y += 40;
          this.cardFlipAudio();
        }
        break;
    }
  },


  // Add scores when the Player stands on gems or on the star.
  addScores: function addScores(object) {
    switch (object) {
      case 'gem-blue':
        this.scores += 50;
        break;
      case 'gem-green':
        this.scores += 75;
        break;
      case 'gem-orange':
        this.scores += 100;
        break;
      case 'Star':
        this.scores += 200;
        engine.endGame(this.scores, this.lives, 'victory');
        break;
      default:
        this.lives += 1;
        break;
    }

    engine.print('scores', this.scores);
    engine.print('lives', this.lives);
  },


  // Reset player's position on death
  reset: function reset() {
    var newGame = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

    this.x = 350;
    this.y = 480;

    if (!newGame) {
      this.lives -= 1;
      engine.print('scores', this.scores);
      engine.print('lives', this.lives);

      if (this.lives < 1) {
        engine.endGame(this.scores, this.lives, 'defeat');

        this.lives = 3;
        this.scores = 0;
      }
    } else {
      this.lives = 3;
      this.scores = 0;

      engine.print('scores', this.scores);
      engine.print('lives', this.lives);
    }
  }
};

// Static objects: gems, heart, star
function StaticObj(x, y, sprite, name) {
  this.x = x;
  this.y = y;
  this.sprite = sprite;
  this.name = name;
}

StaticObj.prototype = {
  // Draw the player on the screen, required method for game
  render: function render() {
    engine.ctx.drawImage(resources.get(this.sprite), this.x, this.y);
  },


  // Resets position on a new game.
  reset: function reset() {
    var minRow = void 0;
    var maxRow = void 0;

    if (/gem/.test(this.name)) {
      minRow = 7;
      maxRow = 12;
    } else if (/Heart/.test(this.name)) {
      minRow = 1;
      maxRow = 5;
    } else {
      this.x = 350;
      this.y = 0;
      return;
    }

    // Function to create random rows and columns
    var randomFunction = function randomFunction(min, max, type) {
      var size = type === 'row' ? 40 : 50;

      return (Math.floor(Math.random() * (max - min)) + min) * size;
    };

    this.x = randomFunction(1, 14, 'column');
    this.y = randomFunction(minRow, maxRow, 'row');

    while (staticObjectsCoordinates.includes(this.x + '-' + this.y)) {
      this.x = randomFunction(1, 14, 'column');
      this.y = randomFunction(minRow, maxRow, 'row');
    }

    staticObjectsCoordinates.push(this.x + '-' + this.y);
  }
};

// Instantiation of all objects
var rowsWithEnemies = 5;
var allEnemies = [];
var allLogs = [];
var allStaticObjects = [];
var deletedStaticObjects = [];
var staticObjectsCoordinates = [];
var firstPositionsOfObjects = {};

// Create three enemies per row
for (var i = 0; i < rowsWithEnemies; i += 1) {
  if (i % 2 !== 0) {
    allEnemies.push(new Enemy(i, 'first', 'Enemy'));
    allEnemies.push(new Enemy(i, 'second', 'Enemy'));
    // allEnemies.push(new Enemy(i, 'third', 'Enemy'));
  } else {
    allEnemies.push(new EnemyToLeft(i, 'first', 'EnemyToLeft'));
    allEnemies.push(new EnemyToLeft(i, 'second', 'EnemyToLeft'));
    // allEnemies.push(new EnemyToLeft(i, 'third', 'EnemyToLeft'));
  }
}

// Create three enemies per row
for (var _i = 0; _i < rowsWithEnemies; _i += 1) {
  if (_i % 2 !== 0) {
    allLogs.push(new Log(_i, 'first', 'Log'));
    allLogs.push(new Log(_i, 'second', 'Log'));
    allLogs.push(new Log(_i, 'third', 'Log'));
    allLogs.push(new Log(_i, 'fourth', 'Log'));
  } else {
    allLogs.push(new LogToLeft(_i, 'first', 'LogToLeft'));
    allLogs.push(new LogToLeft(_i, 'second', 'LogToLeft'));
    allLogs.push(new LogToLeft(_i, 'third', 'LogToLeft'));
    allLogs.push(new LogToLeft(_i, 'fourth', 'LogToLeft'));
    allLogs.push(new LogToLeft(_i, 'fifth', 'LogToLeft'));
  }
}

// Create player
var player = new Player();

// Create all static objects
(function createStaticObjects() {
  var tempArray = [];

  var urls = ['build/images/gem-blue.png', 'build/images/gem-green.png', 'build/images/gem-orange.png', 'build/images/Heart.png', 'build/images/Star.png'];

  var names = ['gem-blue', 'gem-green', 'gem-orange', 'Heart', 'Star'];

  // Function to create random rows and columns
  var randomFunction = function randomFunction(min, max, type) {
    var size = type === 'row' ? 40 : 50;

    return (Math.floor(Math.random() * (max - min)) + min) * size;
  };

  // Helper function to create any number of any static object (gems, hearts etc)
  var createObject = function createObject(numberOfObjects, objectIndex, minRow, maxRow, coordinateX, coordinateY) {
    var name = names[objectIndex];
    var sprite = urls[objectIndex];

    if (coordinateX) {
      var obj = new StaticObj(coordinateX * 50, coordinateY, sprite, name);
      allStaticObjects.push(obj);
      return;
    }

    for (var _i2 = 0; _i2 < numberOfObjects; _i2 += 1) {
      var x = randomFunction(1, 14, 'column');
      var y = randomFunction(minRow, maxRow, 'row');

      while (tempArray.includes(x + '-' + y)) {
        x = randomFunction(1, 14, 'column');
        y = randomFunction(minRow, maxRow, 'row');
      }

      tempArray.push(x + '-' + y);

      var _obj = new StaticObj(x, y, sprite, name);
      allStaticObjects.push(_obj);
    }
  };

  // Create gems and randomize their locations
  createObject(3, 0, 7, 12); // 3 blue gems
  createObject(2, 1, 7, 12); // 2 green gems
  createObject(1, 2, 7, 12); // 1 orange gem

  // Create heart and star
  createObject(1, 3, 1, 5);
  createObject(1, 4, 0, 0, 7, 0);

  // This listens for key presses and sends the keys to your
  // Player.handleInput() method. You don't need to modify this.
  document.addEventListener('keyup', function (e) {
    var allowedKeys = {
      37: 'left',
      38: 'up',
      39: 'right',
      40: 'down'
    };

    if (allowedKeys[e.keyCode]) {
      player.handleInput(allowedKeys[e.keyCode]);
    }
  });
})();

/* eslint-env browser */

/* Engine.js
 * This file provides the game loop functionality (update entities and render),
 * draws the initial game board on the screen, and then calls the update and
 * render methods on your player and enemy objects (defined in your app.js).
 *
 * A game engine works by drawing the entire game screen over and over, kind of
 * like a flipbook you may have created as a kid. When your player moves across
 * the screen, it may look like just that image/character is moving or being
 * drawn but that is not the case. What's really happening is the entire "scene"
 * is being drawn over and over, presenting the illusion of animation.
 *
 * This engine makes the canvas' context (ctx) object globally available to make
 * writing app.js a little simpler to work with.
 */

var engine = function IIFE() {
  /* Predefine the variables we'll be using within this scope,
   * create the canvas element, grab the 2D context for that canvas
   * set the canvas elements height/width and add it to the DOM.
   */
  var canvas = document.createElement('canvas');
  canvas.className = 'canvas__main';
  var ctx = canvas.getContext('2d');
  var stop = false;
  var fpsInterval = void 0;
  var now = void 0;
  var then = void 0;
  var elapsed = void 0;

  // If player is on log he should move with this log
  var playerIsOnLog = false;
  var logWithPlayer = null;

  canvas.width = 750;
  canvas.height = 570;
  document.querySelector('.canvas__board').appendChild(canvas);

  /* This function does nothing but it could have been a good place to
   * handle game reset states - maybe a new game menu or a game over screen
   * those sorts of things. It's only called once by the init() method.
   */
  function reset() {
    // Delete coordinates array, to fill it again with new values
    staticObjectsCoordinates.splice(0, staticObjectsCoordinates.length);

    // Refill all static objects array with deleted objects
    allStaticObjects.push.apply(allStaticObjects, _toConsumableArray(deletedStaticObjects.splice(0, deletedStaticObjects.length)));

    // Initialize reset method on all objects
    allEnemies.forEach(function (enemy) {
      return enemy.reset();
    });
    allLogs.forEach(function (log) {
      return log.reset();
    });
    allStaticObjects.forEach(function (staticObject) {
      return staticObject.reset();
    });
    player.reset(true);
  }

  /* This function is called by main (our game loop) and itself calls all
   * of the functions which may need to update entity's data. Based on how
   * you implement your collision detection (when two entities occupy the
   * same space, for instance when your character should die), you may find
   * the need to add an additional function call here. For now, we've left
   * it commented out - you may or may not want to implement this
   * functionality this way (you could just implement collision detection
   * on the entities themselves within your app.js file).
   */
  function checkCollisions() {
    var playerX = player.x;
    var playerY = player.y;

    // Reset every iteration floating on logs
    playerIsOnLog = false;
    logWithPlayer = null;

    // Index of taken interactive object
    var index = null;
    var objectName = null;

    if (playerY >= 280 && playerY <= 440) {
      // Cheking collisions with enemies
      allEnemies.forEach(function (enemy) {
        if (enemy.y === playerY && playerX < enemy.x + 40 && playerX + 40 > enemy.x) {
          player.reset();
        }
      });
    } else if (playerY >= 40 && playerY <= 200) {
      // Checking collisions with logs. If Player is on water tiles and don't stand on logs,
      // he'll lost one life and reset his position.
      allLogs.forEach(function (log) {
        if (log.y === playerY && playerX < log.x + 50 && playerX + 50 > log.x) {
          playerIsOnLog = true;
          logWithPlayer = log;
        }
      });

      if (!playerIsOnLog) {
        player.reset();
      }
    }

    // Checking collisions with gems, heart and star
    allStaticObjects.forEach(function (staticObject, i) {
      if (staticObject.y === playerY && playerX < staticObject.x + 50 && playerX + 50 > staticObject.x) {
        index = i;
        objectName = staticObject.name;
      }
    });

    // This code will remove static object, if Player will stand on the same tile.
    // It's needed to prevent rendering this object.
    if (index !== null) {
      var deletedElement = allStaticObjects.splice(index, 1)[0];
      deletedStaticObjects.push(deletedElement);
      player.addScores(objectName);
    }
  }

  /* This function serves as the kickoff point for the game loop itself
   * and handles properly calling the update and render methods.
   */
  // this function was taken from
  // https://stackoverflow.com/questions/19764018/controlling-fps-with-requestanimationframe
  function animate(newtime) {
    // stop
    if (stop) {
      return;
    }

    // request another frame
    requestAnimationFrame(animate);

    // calc elapsed time since last loop
    now = newtime;
    elapsed = now - then;

    // if enough time has elapsed, draw the next frame
    if (elapsed > fpsInterval) {
      // Get ready for next frame by setting then=now, but...
      // Also, adjust for fpsInterval not being multiple of 16.67
      then = now - elapsed % fpsInterval;

      /* Call our update/render functions, pass along the time delta to
       * our update function since it may be used for smooth animation.
       */
      updateEntities();
      checkCollisions();
      render();
    }
  }

  // Begin all animations
  function startAnimating(fps) {
    stop = false;
    fpsInterval = 1000 / fps;
    then = window.performance.now();
    animate();
  }

  /* This function does some initial setup that should only occur once,
   * particularly setting the lastTime variable that is required for the
   * game loop.
   */
  function init() {
    var openModal = document.querySelector('.open__modal');
    var startGame = document.querySelector('.new__game');
    var overlay = document.querySelector('.overlay');
    var modal = document.querySelector('.modal');

    render();

    // Add eventListener to start a new game button.
    // It will close the modal window and start the game.
    startGame.addEventListener('click', function () {
      var endingModal = document.querySelector('.end__game');

      if (endingModal.classList.contains('opened')) {
        toggleEndingModal();
      }

      overlay.classList.toggle('overlay__opened');
      modal.classList.toggle('modal__opened');

      reset();
      startAnimating(60);
    });

    // Add event listener to reset button. Opens the modal window and stops the game.
    openModal.addEventListener('click', function () {
      overlay.classList.toggle('overlay__opened');
      modal.classList.toggle('modal__opened');

      stop = true;
    });
  }

  /* This is called by the update function and loops through all of the
   * objects within your allEnemies array as defined in app.js and calls
   * their update() methods. It will then call the update function for your
   * player object. These update methods should focus purely on updating
   * the data/properties related to the object. Do your drawing in your
   * render methods.
   * Allows player to float on logs
   */
  function updateEntities() {
    allEnemies.forEach(function (enemy) {
      return enemy.update();
    });

    allLogs.forEach(function (log) {
      if (log === logWithPlayer) {
        log.update(player);
      } else {
        log.update();
      }
    });

    player.update();
  }

  /* This function initially draws the "game level", it will then call
   * the renderEntities function. Remember, this function is called every
   * game tick (or loop of the game engine) because that's how games work -
   * they are flipbooks creating the illusion of animation but in reality
   * they are just drawing the entire screen over and over.
   */
  function render() {
    /* This array holds the relative URL to the image used
     * for that particular row of the game level.
     */
    var rowImages = ['build/images/grass-block.png', 'build/images/water-block.png', 'build/images/water-block.png', 'build/images/water-block.png', 'build/images/water-block.png', 'build/images/water-block.png', 'build/images/grass-block.png', 'build/images/stone-block.png', 'build/images/stone-block.png', 'build/images/stone-block.png', 'build/images/stone-block.png', 'build/images/stone-block.png', 'build/images/grass-block.png'];
    var numRows = rowImages.length; // 13
    var numCols = 15;

    // Before drawing, clear existing canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    /* Loop through the number of rows and columns we've defined above
     * and, using the rowImages array, draw the correct image for that
     * portion of the "grid"
     */
    for (var row = 0; row < numRows; row += 1) {
      for (var col = 0; col < numCols; col += 1) {
        /* The drawImage function of the canvas' context element
         * requires 3 parameters: the image to draw, the x coordinate
         * to start drawing and the y coordinate to start drawing.
         * We're using our Resources helpers to refer to our images
         * so that we get the benefits of caching these images, since
         * we're using them over and over.
         */
        if (row === 0 && col === 7) {
          ctx.drawImage(resources.get('build/images/Selector.png'), col * 50, row * 40);
        } else {
          ctx.drawImage(resources.get(rowImages[row]), col * 50, row * 40);
        }
      }
    }

    renderEntities();
  }

  /* This function is called by the render function and is called on each game
   * tick. Its purpose is to then call the render functions you have defined
   * on your enemy and player entities within app.js
   */
  function renderEntities() {
    /* Loop through all of the objects within the allEnemies array and call
     * the render function you have defined.
     */
    allEnemies.forEach(function (enemy) {
      return enemy.render();
    });
    allLogs.forEach(function (log) {
      return log.render();
    });
    allStaticObjects.forEach(function (staticObject) {
      return staticObject.render();
    });
    player.render();
  }

  // Create menu to choose player type
  (function createMenuToChoosePlayer() {
    var charactersDiv = document.querySelector('.characters');
    var characters = ['build/images/char-boy.png', 'build/images/char-cat-girl.png', 'build/images/char-horn-girl.png', 'build/images/char-pink-girl.png', 'build/images/char-princess-girl.png'];
    var images = [];

    // Creating images for player selection section
    characters.forEach(function (character, i) {
      var image = document.createElement('img');
      var name = characters[i];

      images.push(image);

      image.dataset.url = name;
      image.src = character;

      var _$exec = /(char.+)(?=\.png)/.exec(character);

      var _$exec2 = _slicedToArray(_$exec, 1);

      image.alt = _$exec2[0];

      if (i === 0) image.style.background = '#afa';

      charactersDiv.appendChild(image);

      // Event listener for change player's skin
      image.addEventListener('click', function (e) {
        var name = e.target.dataset.url;
        player.updateSprite(name);
        player.render();
        render();

        // Add green background to selected skin, remove background from other images.
        images.forEach(function (img) {
          if (img !== e.target) {
            img.style.background = '';
          } else {
            img.style.background = '#afa';
          }
        });
      });
    });
  })();

  // Show ending modal window
  function toggleEndingModal() {
    var startingModal = document.querySelector('.start__game');
    var endingModal = document.querySelector('.end__game');

    startingModal.classList.toggle('opened');
    endingModal.classList.toggle('opened');
  }

  /* Go ahead and load all of the images we know we're going to need to
   * draw our game level. Then set init as the callback method, so that when
   * all of these images are properly loaded our game will start.
   */
  resources.load.apply(resources, ['build/images/stone-block.png', 'build/images/water-block.png', 'build/images/grass-block.png', 'build/images/enemy-bug.png', 'build/images/char-boy.png', 'build/images/char-cat-girl.png', 'build/images/char-horn-girl.png', 'build/images/char-pink-girl.png', 'build/images/char-princess-girl.png', 'build/images/log.png', 'build/images/gem-blue.png', 'build/images/gem-green.png', 'build/images/gem-orange.png', 'build/images/Heart.png', 'build/images/Selector.png', 'build/images/Star.png']);

  resources.onReady(init);

  // Return the canvas' context object to use it by app module
  return {
    get ctx() {
      return ctx;
    },

    // This method prints player scores
    print: function print(type, number) {
      if (type === 'scores') {
        var scoresList = document.querySelectorAll('.scores');

        scoresList.forEach(function (elem) {
          elem.textContent = number;
        });
      } else {
        var livesList = document.querySelectorAll('.lives');

        livesList.forEach(function (elem) {
          elem.textContent = number;
        });
      }
    },


    // This method stops the game and shows winning screen
    endGame: function endGame(scores, lives, state) {
      var title = document.querySelector('.end__title');
      toggleEndingModal();

      if (state === 'victory') {
        title.textContent = 'Congratulations! You have won.';
      } else {
        title.textContent = 'Game over';
      }

      var openModal = document.querySelector('.open__modal');
      openModal.dispatchEvent(new Event('click'));
    }
  };
}();