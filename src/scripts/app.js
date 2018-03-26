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
  savePosition(x) {
    firstPositionsOfObjects[this.objectType] = x;
  },

  // Update the object's position
  update() {
    const firstObjectPosition = firstPositionsOfObjects[this.objectType];
    if (this.place === 'first') {
      this.savePosition(this.x);

      this.x = this.x > 800 ?
        -50 :
        this.x + this.speed;
    } else if (firstObjectPosition > this.x || this.x > 750) {
      this.x = firstObjectPosition - 200;
    } else {
      this.x += this.speed;
    }
  },

  // Draw the object on the screen
  render() {
    engine.ctx.drawImage(resources.get(this.sprite), this.x, this.y);
  },
};


// Enemies our player must avoid
function Enemy(y, place, objectType) {
  MovingObject.apply(this, [y, place, objectType]);
  this.x = place === 'second' ? -250 : -50;
  this.sprite = 'build/images/enemy-bug.png';
}

Enemy.prototype = Object.create(MovingObject.prototype);
Enemy.prototype.constructor = Enemy;

// Constructor for enemies moving from right to left (opposite direction)
function EnemyToLeft(y, place, objectType) {
  // The image/sprite for our enemies, this uses
  // a helper we've provided to easily load images
  MovingObject.apply(this, [y, place, objectType]);
  this.x = place === 'second' ? 950 : 750;
  this.sprite = 'build/images/enemy-bug.png';
}

EnemyToLeft.prototype = Object.create(MovingObject.prototype);
EnemyToLeft.prototype.constructor = EnemyToLeft;
EnemyToLeft.prototype.update = function update() {
  const firstObjectPosition = firstPositionsOfObjects[this.objectType];
  // Update the enemy's position, required method for game
  if (this.first) {
    this.savePosition(this.x);

    this.x = this.x < -50 ?
      750 :
      this.x - this.speed;
  } else if (firstObjectPosition < this.x || this.x < -50) {
    this.x = firstObjectPosition + 200;
  } else {
    this.x -= this.speed;
  }
};

EnemyToLeft.prototype.render = function render() {
  // this function was taken from
  // https://stackoverflow.com/questions/3129099/how-to-flip-images-horizontally-with-html5
  const img = resources.get(this.sprite);
  const width = img.width;
  const height = img.height;

  engine.ctx.save();
  // Set the origin to the center of the image
  engine.ctx.translate(this.x + (width / 2), this.y + (height / 2));

  engine.ctx.scale(-1, 1);

  // Draw the image
  engine.ctx.drawImage(img, -width / 2, -height / 2);

  engine.ctx.restore();
};

// Logs on water


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
  update() {},

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
const firstPositionsOfObjects = {};

// Create two enemies per row
for (let i = 0; i < rowsWithEnemies; i += 1) {
  if (i % 2 === 0) {
    allEnemies.push(new Enemy(i, 'first', 'Enemy'));
    allEnemies.push(new Enemy(i, 'second', 'Enemy'));
  } else {
    allEnemies.push(new EnemyToLeft(i, 'first', 'EnemyToLeft'));
    allEnemies.push(new EnemyToLeft(i, 'second', 'EnemyToLeft'));
  }
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