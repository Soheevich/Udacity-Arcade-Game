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

  return {
    /* This is the publicly accessible image loading function. It accepts
     * an array of strings pointing to image files or a string for a single
     * image. It will then call our private image loading function accordingly.
     */
    load: function load() {
      var _this = this;

      for (var _len = arguments.length, urls = Array(_len), _key = 0; _key < _len; _key++) {
        urls[_key] = arguments[_key];
      }

      /* If the developer passed in an array of images or single image
       * loop through each value and call our image loader on that image file
       * Then push returned promise to the promises array
       */
      urls.forEach(function (url) {
        return promises.push(_this.privateLoad(url));
      });

      // This function determines if all of the images that have been requested
      // for loading have in fact been properly loaded.
      Promise.all(promises).then(function () {
        readyCallbacks.forEach(function (func) {
          return func();
        });
      });
    },


    // Creating a new promise to wait until an image is loaded
    checkImage: function checkImage(url) {
      return new Promise(function (resolve) {
        var img = document.createElement('img');
        img.src = url;
        img.onload = function () {
          return resolve(img);
        };
        // img.onerror = () => resolve(img);
      });
    },


    /* This is our private image loader function, it is
     * called by the public image loader function.
     */
    privateLoad: function privateLoad(url) {
      if (resourceCache[url]) {
        /* If this URL has been previously loaded it will exist within
         * our resourceCache array. Just return that image rather
         * re-loading the image.
         */
        return resourceCache[url];
      }

      /* Once our image has properly loaded, add it to our cache
       * so that we can simply return this image if the developer
       * attempts to load this file in the future.
       */
      return this.checkImage(url).then(function (img) {
        resourceCache[url] = img;
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

// Enemies our player must avoid
function Enemy(y) {
  // The image/sprite for our enemies, this uses
  // a helper we've provided to easily load images
  this.x = this.random(-800, -80);
  this.y = [40, 80, 120, 160, 200][y];
  this.speed = y === 1 ? 1.5 : 1;
  this.sprite = 'build/images/enemy-bug.png';
}

Enemy.prototype = {
  random: function random(max, min) {
    return Math.random() * (max - min) + min;
  },

  // Update the enemy's position, required method for game
  // Parameter: dt, a time delta between ticks
  update: function update(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.

    this.x = this.x > 550 ? this.random(-800, -80) * this.speed : this.x + dt * 200 * this.speed;
  },


  // Draw the enemy on the screen, required method for game
  render: function render() {
    engine.ctx.drawImage(resources.get(this.sprite), this.x, this.y);
  },
  reset: function reset() {
    this.x = this.random(-600, -80);
  }
};

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.

function Player() {
  var index = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;

  var characters = ['build/images/char-boy.png', 'build/images/char-cat-girl.png', 'build/images/char-horn-girl.png', 'build/images/char-pink-girl.png', 'build/images/char-princess-girl.png'];
  this.x = 250;
  this.y = 240;
  this.sprite = characters[index];
}

Player.prototype = {
  // Parameter: dt, a time delta between ticks
  update: function update(dt) {},


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
        if (this.x < 500) {
          this.x += 50;
          this.cardFlipAudio();
        }
        break;
      case 'down':
        if (this.y < 240) {
          this.y += 40;
          this.cardFlipAudio();
        }
        break;
      default:
    }
  },
  reset: function reset() {
    this.x = 250;
    this.y = 240;
  }
};

// Instantiation of all objects
var rowsWithEnemies = 5;
var allEnemies = [];

for (var i = 0; i < rowsWithEnemies; i += 1) {
  allEnemies.push(new Enemy(i));
  allEnemies.push(new Enemy(i));
}
console.log(allEnemies);
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
  var ctx = canvas.getContext('2d');
  var lastTime = void 0;

  canvas.width = 550;
  canvas.height = 330;
  document.querySelector('main').appendChild(canvas);

  /* This function serves as the kickoff point for the game loop itself
   * and handles properly calling the update and render methods.
   */
  function main() {
    /* Get our time delta information which is required if your game
     * requires smooth animation. Because everyone's computer processes
     * instructions at different speeds we need a constant value that
     * would be the same for everyone (regardless of how fast their
     * computer is) - hurray time!
     */
    var now = Date.now();
    var dt = (now - lastTime) / 1000.0;

    /* Call our update/render functions, pass along the time delta to
     * our update function since it may be used for smooth animation.
     */
    update(dt);
    render();

    /* Set our lastTime variable which is used to determine the time delta
     * for the next time this function is called.
     */
    lastTime = now;

    /* Use the browser's requestAnimationFrame function to call this
     * function again as soon as the browser is able to draw another frame.
     */
    window.requestAnimationFrame(main);
  }

  /* This function does some initial setup that should only occur once,
   * particularly setting the lastTime variable that is required for the
   * game loop.
   */
  function init() {
    reset();
    lastTime = Date.now();
    main();
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

    allEnemies.forEach(function (enemy) {
      if (enemy.y === playerY && playerX < enemy.x + 50 && playerX + 50 > enemy.x) {
        player.reset();
      }
    });
  }

  function update(dt) {
    updateEntities(dt);
    checkCollisions();
  }

  /* This is called by the update function and loops through all of the
   * objects within your allEnemies array as defined in app.js and calls
   * their update() methods. It will then call the update function for your
   * player object. These update methods should focus purely on updating
   * the data/properties related to the object. Do your drawing in your
   * render methods.
   */
  function updateEntities(dt) {
    allEnemies.forEach(function (enemy) {
      return enemy.update(dt);
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
    var rowImages = ['build/images/water-block.png', // Top row is water
    'build/images/stone-block.png', // Row 1 of 5 of stone
    'build/images/stone-block.png', // Row 2 of 5 of stone
    'build/images/stone-block.png', // Row 3 of 5 of stone
    'build/images/stone-block.png', // Row 4 of 5 of stone
    'build/images/stone-block.png', // Row 5 of 5 of stone
    'build/images/grass-block.png'];
    var numRows = 7;
    var numCols = 11;

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

  /* This function does nothing but it could have been a good place to
   * handle game reset states - maybe a new game menu or a game over screen
   * those sorts of things. It's only called once by the init() method.
   */
  function reset() {}
  // noop


  /* Go ahead and load all of the images we know we're going to need to
   * draw our game level. Then set init as the callback method, so that when
   * all of these images are properly loaded our game will start.
   */
  resources.load.apply(resources, ['build/images/stone-block.png', 'build/images/water-block.png', 'build/images/grass-block.png', 'build/images/enemy-bug.png', 'build/images/char-boy.png']);
  resources.onReady(init);

  // Return the canvas' context object to use it by app module
  return {
    get ctx() {
      return ctx;
    }
  };
}();