/* eslint-env browser */

// The super class for every moving object
function MovingObject(y, place, objectType) {
  this.y = [280, 320, 360, 400, 440][y];
  this.place = place;
  this.objectType = objectType;
  if (y === 1 || y === 4) {
    this.speed = 3;
  } else if (y === 0) {
    this.speed = 1;
  } else {
    this.speed = 1.5;
  }
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
  render() {
    engine.ctx.drawImage(resources.get(this.sprite), this.x, this.y);
  },
};


// Logs in the water
function Log(y, place, objectType) {
  MovingObject.apply(this, [y, place, objectType]);
  this.y = [40, 80, 120, 160, 200][y];
  this.sprite = 'build/images/log.png';
  this.place = place;

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
Log.prototype.update = function update(player) {
  const firstObjectPosition = firstPositionsOfObjects[this.objectType];
  if (this.place === 'first') {
    this.savePosition(this.x);

    this.x = this.x > 800 ?
      -50 :
      this.x + this.speed;
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
LogToLeft.prototype.update = function update(player) {
  const firstObjectPosition = firstPositionsOfObjects[this.objectType];
  // Update the enemy's position, required method for game
  if (this.place === 'first') {
    this.savePosition(this.x);

    this.x = this.x < -50 ?
      750 :
      this.x - this.speed;
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

  if (this.place === 'first') {
    this.x = -50;
  } else if (this.place === 'second') {
    this.x = -250;
  } else if (this.place === 'third') {
    this.x = -450;
  }
}

Enemy.prototype = Object.create(MovingObject.prototype);
Enemy.prototype.constructor = Enemy;
Enemy.prototype.reset = function reset() {
  if (this.place === 'first') {
    this.x = -50;
  } else if (this.place === 'second') {
    this.x = -250;
  } else if (this.place === 'third') {
    this.x = -450;
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
  } else if (this.place === 'third') {
    this.x = 1150;
  }
}

EnemyToLeft.prototype = Object.create(MovingObject.prototype);
EnemyToLeft.prototype.constructor = EnemyToLeft;
EnemyToLeft.prototype.update = function update() {
  const firstObjectPosition = firstPositionsOfObjects[this.objectType];
  // Update the enemy's position, required method for game
  if (this.place === 'first') {
    this.savePosition(this.x);

    this.x = this.x < -50 ?
      750 :
      this.x - this.speed;
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

EnemyToLeft.prototype.reset = function reset() {
  if (this.place === 'first') {
    this.x = 750;
  } else if (this.place === 'second') {
    this.x = 950;
  } else if (this.place === 'third') {
    this.x = 1150;
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
  updateSprite(name) {
    this.sprite = name;
  },

  // If player is on log, it will move him
  update(x = 0) {
    this.x += x;

    if (this.y < 40 || this.y > 200) {
      const remainder = this.x % 50;

      this.x = remainder > 25 ?
        this.x + (50 - remainder) :
        this.x - remainder;
    }
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
    }
  },

  addScores(object) {
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
        engine.endGame(this.scores, this.lives);
        break;
      default:
        this.lives += 1;
        break;
    }

    engine.print('scores', this.scores);
    engine.print('lives', this.lives);
  },

  // Reset player's position on death
  reset(newGame = false) {
    this.x = 350;
    this.y = 480;

    if (!newGame) {
      this.lives -= 1;
      engine.print('scores', this.scores);
      engine.print('lives', this.lives);

      if (this.lives < 1) {
        engine.endGame(this.scores, this.lives);

        this.lives = 3;
        this.scores = 0;
      }
    } else {
      engine.print('scores', this.scores);
      engine.print('lives', this.lives);
    }
  },
};


// Static objects
function StaticObj(x, y, sprite, name) {
  this.x = x;
  this.y = y;
  this.sprite = sprite;
  this.name = name;
}

StaticObj.prototype = {
  // Draw the player on the screen, required method for game
  render() {
    engine.ctx.drawImage(resources.get(this.sprite), this.x, this.y);
  },

  reset() {
    let minRow;
    let maxRow;

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
    const randomFunction = (min, max, type) => {
      const size = type === 'row' ? 40 : 50;

      return (Math.floor(Math.random() * (max - min)) + min) * size;
    };

    this.x = randomFunction(1, 14, 'column');
    this.y = randomFunction(minRow, maxRow, 'row');

    while (staticObjectsCoordinates.includes(`${this.x}-${this.y}`)) {
      this.x = randomFunction(1, 14, 'column');
      this.y = randomFunction(minRow, maxRow, 'row');
    }

    staticObjectsCoordinates.push(`${this.x}-${this.y}`);
  },
};


// Instantiation of all objects
const rowsWithEnemies = 5;
const allEnemies = [];
const allLogs = [];
const allStaticObjects = [];
const deletedStaticObjects = [];
const staticObjectsCoordinates = [];
const firstPositionsOfObjects = {};


// Create three enemies per row
for (let i = 0; i < rowsWithEnemies; i += 1) {
  if (i % 2 !== 0) {
    allEnemies.push(new Enemy(i, 'first', 'Enemy'));
    allEnemies.push(new Enemy(i, 'second', 'Enemy'));
    allEnemies.push(new Enemy(i, 'third', 'Enemy'));
  } else {
    allEnemies.push(new EnemyToLeft(i, 'first', 'EnemyToLeft'));
    allEnemies.push(new EnemyToLeft(i, 'second', 'EnemyToLeft'));
    allEnemies.push(new EnemyToLeft(i, 'third', 'EnemyToLeft'));
  }
}


// Create three enemies per row
for (let i = 0; i < rowsWithEnemies; i += 1) {
  if (i % 2 !== 0) {
    allLogs.push(new Log(i, 'first', 'Log'));
    allLogs.push(new Log(i, 'second', 'Log'));
    allLogs.push(new Log(i, 'third', 'Log'));
    allLogs.push(new Log(i, 'fourth', 'Log'));
  } else {
    allLogs.push(new LogToLeft(i, 'first', 'LogToLeft'));
    allLogs.push(new LogToLeft(i, 'second', 'LogToLeft'));
    allLogs.push(new LogToLeft(i, 'third', 'LogToLeft'));
    allLogs.push(new LogToLeft(i, 'fourth', 'LogToLeft'));
    allLogs.push(new LogToLeft(i, 'fifth', 'LogToLeft'));
  }
}


// Create player
const player = new Player();


// Create all static objects
(function createStaticObjects() {
  const tempArray = [];

  const urls = [
    'build/images/gem-blue.png',
    'build/images/gem-green.png',
    'build/images/gem-orange.png',
    'build/images/Heart.png',
    'build/images/Star.png',
  ];

  const names = [
    'gem-blue',
    'gem-green',
    'gem-orange',
    'Heart',
    'Star',
  ];

  // Function to create random rows and columns
  const randomFunction = (min, max, type) => {
    const size = type === 'row' ? 40 : 50;

    return (Math.floor(Math.random() * (max - min)) + min) * size;
  };

  // Helper function to create any number of any static object (gems, hearts etc)
  const createObject = (numberOfObjects, objectIndex, minRow, maxRow, coordinateX, coordinateY) => {
    const name = names[objectIndex];
    const sprite = urls[objectIndex];

    if (coordinateX) {
      const obj = new StaticObj(coordinateX * 50, coordinateY, sprite, name);
      allStaticObjects.push(obj);
      return;
    }

    for (let i = 0; i < numberOfObjects; i += 1) {
      let x = randomFunction(1, 14, 'column');
      let y = randomFunction(minRow, maxRow, 'row');

      while (tempArray.includes(`${x}-${y}`)) {
        x = randomFunction(1, 14, 'column');
        y = randomFunction(minRow, maxRow, 'row');
      }

      tempArray.push(`${x}-${y}`);

      const obj = new StaticObj(x, y, sprite, name);
      allStaticObjects.push(obj);
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
}());
