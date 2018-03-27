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

const engine = (function IIFE() {
  /* Predefine the variables we'll be using within this scope,
   * create the canvas element, grab the 2D context for that canvas
   * set the canvas elements height/width and add it to the DOM.
   */
  const canvas = document.createElement('canvas');
  canvas.className = 'canvas';
  const ctx = canvas.getContext('2d');
  let stop = false;
  let fpsInterval;
  let now;
  let then;
  let elapsed;

  // If player is on log he should move with this log
  let playerIsOnLog = false;
  let logWithPlayer = null;

  canvas.width = 750;
  canvas.height = 570;
  document.querySelector('main').appendChild(canvas);

  /* This function does nothing but it could have been a good place to
  * handle game reset states - maybe a new game menu or a game over screen
  * those sorts of things. It's only called once by the init() method.
  */
  function reset() {

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
    const playerX = player.x;
    const playerY = player.y;

    // Reset every iteration floating on logs
    playerIsOnLog = false;
    logWithPlayer = null;

    if (playerY >= 280 && playerY <= 440) {
      allEnemies.forEach((enemy) => {
        if (enemy.y === playerY && (playerX < (enemy.x + 50) && (playerX + 50) > enemy.x)) {
          player.reset();
        }
      });
    } else if (playerY >= 40 && playerY <= 200) {

      allLogs.forEach((log) => {
        if (log.y === playerY && (playerX < (log.x + 50) && (playerX + 50) > log.x)) {
          playerIsOnLog = true;
          logWithPlayer = log;
        }
      });

      if (!playerIsOnLog) {
        player.reset();
      }
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
      then = now - (elapsed % fpsInterval);

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
    const button = document.querySelector('button');
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
   * Allows player to float on logs
   */
  function updateEntities() {
    allEnemies.forEach(enemy => enemy.update());

    allLogs.forEach((log) => {
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
    const rowImages = [
      'build/images/grass-block.png',
      'build/images/water-block.png',
      'build/images/water-block.png',
      'build/images/water-block.png',
      'build/images/water-block.png',
      'build/images/water-block.png',
      'build/images/grass-block.png',
      'build/images/stone-block.png',
      'build/images/stone-block.png',
      'build/images/stone-block.png',
      'build/images/stone-block.png',
      'build/images/stone-block.png',
      'build/images/grass-block.png',
    ];
    const numRows = rowImages.length; // 13
    const numCols = 15;

    // Before drawing, clear existing canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    /* Loop through the number of rows and columns we've defined above
     * and, using the rowImages array, draw the correct image for that
     * portion of the "grid"
     */
    for (let row = 0; row < numRows; row += 1) {
      for (let col = 0; col < numCols; col += 1) {
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
    allStaticObjects.forEach(staticObject => staticObject.render());
    allEnemies.forEach(enemy => enemy.render());
    allLogs.forEach(log => log.render());
    player.render();
  }

  /* Go ahead and load all of the images we know we're going to need to
   * draw our game level. Then set init as the callback method, so that when
   * all of these images are properly loaded our game will start.
   */
  resources.load(...[
    'build/images/stone-block.png',
    'build/images/water-block.png',
    'build/images/grass-block.png',
    'build/images/enemy-bug.png',
    'build/images/char-boy.png',
    'build/images/char-cat-girl.png',
    'build/images/char-horn-girl.png',
    'build/images/char-pink-girl.png',
    'build/images/char-princess-girl.png',
    'build/images/log.png',
    'build/images/gem-blue.png',
    'build/images/gem-green.png',
    'build/images/gem-orange.png',
    'build/images/Heart.png',
    'build/images/Selector.png',
    'build/images/Star.png',
  ]);

  resources.onReady(init);

  // Return the canvas' context object to use it by app module
  return {
    get ctx() {
      return ctx;
    },
  };
}());
