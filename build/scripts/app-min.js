'use strict';

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

/* TODO:
  добавить мерцание перса при контакте с врагом, перед тем как он переместится

*/

// The super class for every moving object
function MovingObject(y, place, objectType) {
  this.y = [40, 80, 120, 160, 200, 280, 320, 360, 400, 440][y];
  this.speed = y === 6 ? 4.5 : 3;
  this.place = place;
  this.objectType = objectType;
}

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

// Enemies our player must avoid
function Enemy(y, place, objectType) {
  MovingObject.apply(this, [y, place, objectType]);
  this.sprite = 'build/images/enemy-bug.png';

  if (place === 'first') {
    this.x = -50;
  } else if (place === 'second') {
    this.x = -250;
  } else if (place === 'third') {
    this.x = -450;
  }
}

Enemy.prototype = Object.create(MovingObject.prototype);
Enemy.prototype.constructor = Enemy;

// Constructor for enemies moving from right to left (opposite direction)
function EnemyToLeft(y, place, objectType) {
  MovingObject.apply(this, [y, place, objectType]);
  this.sprite = 'build/images/enemy-bug.png';

  if (place === 'first') {
    this.x = 750;
  } else if (place === 'second') {
    this.x = 950;
  } else if (place === 'third') {
    this.x = 1150;
  }
}

EnemyToLeft.prototype = Object.create(MovingObject.prototype);
EnemyToLeft.prototype.constructor = EnemyToLeft;
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
  } else if (this.place === 'third') {
    if (firstObjectPosition < this.x || this.x < -50) {
      this.x = firstObjectPosition + 400;
    } else {
      this.x -= this.speed;
    }
  }
};

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

// Logs on water


// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
function Player() {
  var index = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;

  var characters = ['build/images/char-boy.png', 'build/images/char-cat-girl.png', 'build/images/char-horn-girl.png', 'build/images/char-pink-girl.png', 'build/images/char-princess-girl.png'];
  this.x = 350;
  this.y = 480;
  this.sprite = characters[index];
}

Player.prototype = {
  update: function update() {},


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
      default:
    }
  },
  reset: function reset() {
    this.x = 350;
    this.y = 480;
  }
};

// Instantiation of all objects
var rowsWithEnemies = 10;
var allEnemies = [];
var firstPositionsOfObjects = {};

// Create three enemies per row
for (var i = 0; i < rowsWithEnemies; i += 1) {
  if (i % 2 === 0) {
    allEnemies.push(new Enemy(i, 'first', 'Enemy'));
    allEnemies.push(new Enemy(i, 'second', 'Enemy'));
    allEnemies.push(new Enemy(i, 'third', 'Enemy'));
  } else {
    allEnemies.push(new EnemyToLeft(i, 'first', 'EnemyToLeft'));
    allEnemies.push(new EnemyToLeft(i, 'second', 'EnemyToLeft'));
    allEnemies.push(new EnemyToLeft(i, 'third', 'EnemyToLeft'));
  }
}
// console.log(allEnemies);
var player = new Player();

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
  canvas.className = 'canvas';
  var ctx = canvas.getContext('2d');
  var stop = false;
  // let frameCount = 0;
  var fpsInterval = void 0;
  // let startTime;
  var now = void 0;
  var then = void 0;
  var elapsed = void 0;

  canvas.width = 750;
  canvas.height = 570;
  document.querySelector('main').appendChild(canvas);

  /* This function does nothing but it could have been a good place to
  * handle game reset states - maybe a new game menu or a game over screen
  * those sorts of things. It's only called once by the init() method.
  */
  function reset() {}
  // noop


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

    allEnemies.forEach(function (enemy) {
      if (enemy.y === playerY && playerX < enemy.x + 50 && playerX + 50 > enemy.x) {
        player.reset();
      }
    });
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

  function startAnimating(fps) {
    fpsInterval = 1000 / fps;
    then = window.performance.now();
    // startTime = then;
    // console.log(startTime);
    animate();
  }

  /* This function does some initial setup that should only occur once,
   * particularly setting the lastTime variable that is required for the
   * game loop.
   */
  function init() {
    var button = document.querySelector('button');
    reset();
    render();
    startAnimating(60);

    // button.addEventListener('click', () => {
    //   alert('works');
    //   startAnimating(60);
    // }, { once: true });
  }

  /* This is called by the update function and loops through all of the
   * objects within your allEnemies array as defined in app.js and calls
   * their update() methods. It will then call the update function for your
   * player object. These update methods should focus purely on updating
   * the data/properties related to the object. Do your drawing in your
   * render methods.
   */
  function updateEntities() {
    allEnemies.forEach(function (enemy) {
      return enemy.update();
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
    var numRows = rowImages.length;
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
        ctx.drawImage(resources.get(rowImages[row]), col * 50, row * 40);
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

    player.render();
  }

  /* Go ahead and load all of the images we know we're going to need to
   * draw our game level. Then set init as the callback method, so that when
   * all of these images are properly loaded our game will start.
   */
  resources.load.apply(resources, ['build/images/stone-block.png', 'build/images/water-block.png', 'build/images/grass-block.png', 'build/images/enemy-bug.png', 'build/images/char-boy.png', 'build/images/char-cat-girl.png', 'build/images/char-horn-girl.png', 'build/images/char-pink-girl.png', 'build/images/char-princess-girl.png']);

  resources.onReady(init);

  // Return the canvas' context object to use it by app module
  return {
    get ctx() {
      return ctx;
    }
  };
}();