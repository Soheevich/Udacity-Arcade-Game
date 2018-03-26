/* eslint-env browser */

// Enemies our player must avoid
function Enemy(y) {
  // The image/sprite for our enemies, this uses
  // a helper we've provided to easily load images
  this.x = this.random(-800, -80);
  this.y = [40, 80, 120, 160, 200, 280, 320, 360, 400, 440][y];
  this.speed = y === 6 ? 4.5 : 3;
  this.sprite = 'build/images/enemy-bug.png';
}

Enemy.prototype = {
  random(max, min) {
    return (Math.random() * (max - min)) + min;
  },
  // Update the enemy's position, required method for game
  // Parameter: dt, a time delta between ticks
  update() {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.

    this.x = this.x > 800 ?
      this.random(-800, -80) * this.speed :
      this.x + this.speed; //
  },

  // Draw the enemy on the screen, required method for game
  render() {
    engine.ctx.drawImage(resources.get(this.sprite), this.x, this.y);
  },

  reset() {
    this.x = this.random(-600, -80);
  },
};

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.

function Player(index = 0) {
  const characters = [
    'build/images/char-boy.png',
    'build/images/char-cat-girl.png',
    'build/images/char-horn-girl.png',
    'build/images/char-pink-girl.png',
    'build/images/char-princess-girl.png',
  ];
  this.x = 350;
  this.y = 480;
  this.sprite = characters[index];
}

Player.prototype = {
  update() {
  },

  // Draw the player on the screen, required method for game
  render() {
    engine.ctx.drawImage(resources.get(this.sprite), this.x, this.y);
  },

  // Audio
  cardFlipAudio() {
    const audio = document.querySelector('audio');
    audio.currentTime = 0;
    audio.play();
  },

  // Player movement method
  handleInput(direction) {
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

  reset() {
    this.x = 350;
    this.y = 480;
  },
};

// Instantiation of all objects
const rowsWithEnemies = 10;
const allEnemies = [];

// Create two enemies per row
for (let i = 0; i < rowsWithEnemies; i += 1) {
  allEnemies.push(new Enemy(i));
  allEnemies.push(new Enemy(i));
}
// console.log(allEnemies);
const player = new Player();


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
