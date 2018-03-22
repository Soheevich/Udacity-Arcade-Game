'use strict';

/* eslint-env browser */

/* Resources.js
 * This is simply an image loading utility. It eases the process of loading
 * image files so that they can be used within your game. It also includes
 * a simple "caching" layer so it will reuse cached images if you attempt
 * to load the same image multiple times.
 */
(function IIFE() {
  var resourceCache = {};
  var loading = [];
  var readyCallbacks = [];

  /* This is the publicly accessible image loading function. It accepts
   * an array of strings pointing to image files or a string for a single
   * image. It will then call our private image loading function accordingly.
   */
  function load(urlOrArr) {
    if (urlOrArr instanceof Array) {
      /* If the developer passed in an array of images
       * loop through each value and call our image
       * loader on that image file
       */
      urlOrArr.forEach(function (url) {
        return privateLoad(url);
      });
    } else {
      /* The developer did not pass an array to this function,
       * assume the value is a string and call our image loader
       * directly.
       */
      privateLoad(urlOrArr);
    }
  }

  /* This is our private image loader function, it is
   * called by the public image loader function.
   */
  function privateLoad(url) {
    if (resourceCache[url]) {
      /* If this URL has been previously loaded it will exist within
       * our resourceCache array. Just return that image rather
       * re-loading the image.
       */
      return resourceCache[url];
    }
    /* This URL has not been previously loaded and is not present
     * within our cache; we'll need to load this image.
     */
    var img = document.createElement('img');
    img.onload = function onload() {
      /* Once our image has properly loaded, add it to our cache
       * so that we can simply return this image if the developer
       * attempts to load this file in the future.
       */
      resourceCache[url] = img;

      /* Once the image is actually loaded and properly cached,
       * call all of the onReady() callbacks we have defined.
       */
      if (isReady()) {
        readyCallbacks.forEach(function (func) {
          return func();
        });
      }
    };

    /* Set the initial cache value to false, this will change when
     * the image's onload event handler is called. Finally, point
     * the image's src attribute to the passed in URL.
     */
    resourceCache[url] = false;
    img.src = url;
  }

  /* This is used by developers to grab references to images they know
   * have been previously loaded. If an image is cached, this functions
   * the same as calling load() on that URL.
   */
  function get(url) {
    return resourceCache[url];
  }

  /* This function determines if all of the images that have been requested
   * for loading have in fact been properly loaded.
   */
  function isReady() {
    var ready = true;
    Object.keys(resourceCache).forEach(function (key) {
      if (resourceCache.hasOwnProperty(key) && !resourceCache[key]) {
        ready = false;
      }
    });

    return ready;
  }

  /* This function will add a function to the callback stack that is called
   * when all requested images are properly loaded.
   */
  function onReady(func) {
    readyCallbacks.push(func);
  }

  /* This object defines the publicly accessible functions available to
   * developers by creating a global Resources object.
   */
  window.Resources = {
    load: load,
    get: get,
    onReady: onReady,
    isReady: isReady
  };
})();

/* eslint-env browser */

// Enemies our player must avoid
function Enemy(y) {
  // The image/sprite for our enemies, this uses
  // a helper we've provided to easily load images
  this.x = this.random();
  this.y = y;
  this.speed = this.random(1.8, 0.8);
  this.sprite = 'build/images/enemy-bug.png';
}

Enemy.prototype = {
  random: function random() {
    var max = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : -50;
    var min = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : -400;

    return Math.floor(Math.random() * (max - min)) + min;
  },

  // Update the enemy's position, required method for game
  // Parameter: dt, a time delta between ticks
  update: function update(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.

    this.x = this.x > 600 ? (this.speed = this.random(1.8, 0.8), this.random() * this.speed) : this.x + dt * 500 * this.speed;
  },


  // Draw the enemy on the screen, required method for game
  render: function render() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
  },
  reset: function reset() {
    this.x = this.random();
    console.log(this.x);
  }
};

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.

function Player(chosenChar) {
  this.x = 202;
  this.y = 395;
  this.sprite = chosenChar;
}

Player.prototype = {
  // Update the enemy's position, required method for game
  // Parameter: dt, a time delta between ticks
  update: function update(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
  },


  // Draw the enemy on the screen, required method for game
  render: function render() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
  },


  // Audio
  cardFlipAudio: function cardFlipAudio() {
    var audio = document.querySelector('audio');
    audio.currentTime = 0;
    audio.play();
  },


  // ------------------------------
  handleInput: function handleInput(direction) {
    switch (direction) {
      case 'left':
        if (this.x > 0) {
          this.x -= 101;
          this.cardFlipAudio();
        }
        break;
      case 'up':
        if (this.y > -20) {
          this.y -= 83;
          this.cardFlipAudio();
        }
        break;
      case 'right':
        if (this.x < 404) {
          this.x += 101;
          this.cardFlipAudio();
        }
        break;
      default:
        if (this.y < 395) {
          this.y += 83;
          this.cardFlipAudio();
        }
        break;
    }
  },
  reset: function reset() {
    this.x = 202;
    this.y = 395;
  }
};

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
var char = 'build/images/char-boy.png';

var enemy1 = new Enemy(63);
var enemy2 = new Enemy(146);
var enemy3 = new Enemy(229);
var player = new Player(char);

var allEnemies = [enemy1, enemy2, enemy3];

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function (e) {
  var allowedKeys = {
    37: 'left',
    38: 'up',
    39: 'right',
    40: 'down'
  };

  if (allowedKeys[e.keyCode]) player.handleInput(allowedKeys[e.keyCode]);
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

var Engine = function IIFE() {
  /* Predefine the variables we'll be using within this scope,
   * create the canvas element, grab the 2D context for that canvas
   * set the canvas elements height/width and add it to the DOM.
   */
  var canvas = document.createElement('canvas');
  var ctx = canvas.getContext('2d');
  var lastTime = void 0;

  canvas.width = 505;
  canvas.height = 606;
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

  function globalReset() {
    alert('reset');
    player.reset();
    allEnemies.forEach(function (enemy) {
      return enemy.reset();
    });
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
      if (enemy.y === playerY && playerX < enemy.x + 80 && playerX + 80 > enemy.x) {
        globalReset();
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
    'build/images/stone-block.png', // Row 1 of 3 of stone
    'build/images/stone-block.png', // Row 2 of 3 of stone
    'build/images/stone-block.png', // Row 3 of 3 of stone
    'build/images/grass-block.png', // Row 1 of 2 of grass
    'build/images/grass-block.png' // Row 2 of 2 of grass
    ];
    var numRows = 6;
    var numCols = 5;
    var row = void 0;
    var col = void 0;

    // Before drawing, clear existing canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    /* Loop through the number of rows and columns we've defined above
     * and, using the rowImages array, draw the correct image for that
     * portion of the "grid"
     */
    for (row = 0; row < numRows; row += 1) {
      for (col = 0; col < numCols; col += 1) {
        /* The drawImage function of the canvas' context element
         * requires 3 parameters: the image to draw, the x coordinate
         * to start drawing and the y coordinate to start drawing.
         * We're using our Resources helpers to refer to our images
         * so that we get the benefits of caching these images, since
         * we're using them over and over.
         */
        ctx.drawImage(Resources.get(rowImages[row]), col * 101, row * 83);
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
  Resources.load(['build/images/stone-block.png', 'build/images/water-block.png', 'build/images/grass-block.png', 'build/images/enemy-bug.png', 'build/images/char-boy.png']);
  Resources.onReady(init);

  // Assign the canvas' context object to the window object
  window.ctx = ctx;
}();