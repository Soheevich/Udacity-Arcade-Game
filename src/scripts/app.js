/* eslint-env browser */

// Enemies our player must avoid
function Enemy() {
  // The image/sprite for our enemies, this uses
  // a helper we've provided to easily load images
  this.sprite = 'build/images/enemy-bug.png';
}

Enemy.prototype = {
  // Update the enemy's position, required method for game
  // Parameter: dt, a time delta between ticks
  update(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
  },

  // Draw the enemy on the screen, required method for game
  render() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
  },
};

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.

function Player(chosenChar) {
  this.sprite = chosenChar;
}

Player.prototype = {
  // Update the enemy's position, required method for game
  // Parameter: dt, a time delta between ticks
  update(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
  },

  // Draw the enemy on the screen, required method for game
  render() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
  },
};

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
const char = 'build/images/char-boy.png';

const enemy1 = new Enemy();
const enemy2 = new Enemy();
const player = new Player(char);

const allEnemies = [enemy1, enemy2];

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', (e) => {
  const allowedKeys = {
    37: 'left',
    38: 'up',
    39: 'right',
    40: 'down',
  };

  player.handleInput(allowedKeys[e.keyCode]);
});
