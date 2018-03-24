/* eslint-env browser */

// Enemies our player must avoid
function Enemy(y, speed = 1) {
  // The image/sprite for our enemies, this uses
  // a helper we've provided to easily load images
  this.x = this.random();
  this.y = y;
  this.speed = speed;
  this.sprite = speed === 1 ? 'build/images/enemy-bug.png' : 'build/images/enemy-bug-fast.png';
  this.rows = [63, 146, 229, 312];
}

Enemy.prototype = {
  random(max = -600, min = -80) {
    return (Math.trunc(Math.random() * (max - min) * 10) / 10) + min;
  },
  // Update the enemy's position, required method for game
  // Parameter: dt, a time delta between ticks
  update(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.

    if (this.x > 600) {
      this.x = this.random() * this.speed;
      if (this.speed > 1) {
        this.y = this.rows[Math.floor(Math.random() * 4)];
      }
    } else {
      this.x = this.x + (dt * 300 * this.speed);
    }
  },

  // Draw the enemy on the screen, required method for game
  render() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
  },

  reset() {
    this.x = this.random();
    console.log(this.x);
  },
};

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.

function Player(index) {
  const characters = [
    'build/images/char-boy.png',
    'build/images/char-cat-girl.png',
    'build/images/char-horn-girl.png',
    'build/images/char-pink-girl.png',
    'build/images/char-princess-girl.png',
  ];
  this.x = 202;
  this.y = 395;
  this.sprite = characters[index];
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

  // Audio
  cardFlipAudio() {
    const audio = document.querySelector('audio');
    audio.currentTime = 0;
    audio.play();
  },

  // ------------------------------
  handleInput(direction) {
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

  reset() {
    this.x = 202;
    this.y = 395;
  },
};

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player

const enemy1 = new Enemy(63);
const enemy2 = new Enemy(146);
const enemy3 = new Enemy(229);
const enemy4 = new Enemy(312);
const enemy5 = new Enemy(63, 1.5);
const player = new Player(0);

const allEnemies = [enemy1, enemy2, enemy3, enemy4, enemy5];

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', (e) => {
  const allowedKeys = {
    37: 'left',
    38: 'up',
    39: 'right',
    40: 'down',
  };

  if (allowedKeys[e.keyCode]) {
    player.handleInput(allowedKeys[e.keyCode]);
  }
});
