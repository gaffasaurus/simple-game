const canvas = document.querySelector(".myCanvas");
const width = canvas.width = 950;
const height = canvas.height = 550;
const ctx = canvas.getContext("2d");

const canvas2 = document.querySelector(".myCanvas2");
canvas2.width = 950;
canvas2.height = 550;
const ctx2 = canvas2.getContext("2d");

let score = 0;
let lives = 3;

let isGameOver = false;

function degToRad(degrees) {
  return degrees * Math.PI / 180;
}
function between(n, lower, upper) {
  return n >= lower && n <= upper;
}

function clearCanvas(ctx) {
  ctx.fillStyle = "rgb(200, 255, 200)";
  ctx.fillRect(0, 0, width, height);
}

clearCanvas(ctx);

const playerPos = [];
function drawPlayer(x, y, r) {
  ctx.fillStyle = "rgb(0, 255, 255)";
  ctx.strokeStyle = "rgb(0, 0, 0)";

  ctx.beginPath();
  ctx.arc(x, y, r, degToRad(0), degToRad(360), false);
  ctx.fill();
  ctx.stroke();
  playerPos.push(x);
  playerPos.push(y);
  playerPos.push(r);

  ctx.fillStyle = "rgb(0, 0, 0)";

  ctx.beginPath();
  ctx.arc(x - r/2, y - r/6, 5, degToRad(0), degToRad(360), false);
  ctx.fill();

  ctx.beginPath();
  ctx.arc(x + r/2, y - r/6, 5, degToRad(0), degToRad(360), false);
  ctx.fill();

  ctx.beginPath();
  ctx.moveTo(x - 7, y);
  ctx.lineTo(x + 7, y);
  ctx.stroke();
}

const playerRadius = 30;

ctx.fillStyle = "rgb(0, 255, 255)";
drawPlayer(width/2, height/2, playerRadius);

//create enemies
const enemies = [
  new Enemy(100, 100, 30, "rgb(255, 0, 0)", 4, 6),
  new Enemy(100, 100, 40, "rgb(128, 0, 128)", 6, 4),
  new Enemy(width - 100, height - 100, 45, "rgb(255, 89, 0)", -5, -8),
  new Enemy(width/2, height - 100, 20, "rgb(255, 255, 0)", 10, 2)
]


let keyPressed = {};

document.addEventListener('keydown', e => {
  keyPressed[e.key] = true;
});
document.addEventListener('keyup', e => {
  keyPressed[e.key] = false;
});

function checkBorder(r) {
  if (playerPos[0] - r <= 0) {
    playerPos[0] = r;
  }
  if (playerPos[0] + r >= width) {
    playerPos[0] = width - r;
  }
  if (playerPos[1] - r <= 0) {
    playerPos[1] = r;
  }
  if (playerPos[1] + r >= height) {
    playerPos[1] = height - r;
  }
}

let foodLocations = [];
let foodSize = 15;
function drawFood(circleX, circleY, circleR) {
  if (foodLocations.length < 5) {
    ctx2.fillStyle = "rgb(255, 110, 110)";
    ctx2.strokeStyle = "rgb(0, 0, 0)";

    let x = Math.floor(Math.random() * (width - 20)) + foodSize ;
    while (between(x + foodSize , circleX - circleR, circleX + circleR)) {
      x = Math.floor(Math.random() * (width - 20)) + foodSize ;
    }

    let y = Math.floor(Math.random() * (height - 20)) + foodSize ;
    while (between(y + foodSize , circleY - circleR, circleY + circleR)) {
      y = Math.floor(Math.random() * (height - 20)) + foodSize ;
    }
    ctx2.fillRect(x, y, foodSize , foodSize);
    ctx2.strokeRect(x, y, foodSize , foodSize)
    foodLocations.push({
      x: x,
      y: y
    });
  }
}

function eatFood(r) {
  for (i = 0; i < foodLocations.length; i++) {
    if ((between(foodLocations[i]['x'], playerPos[0] - r - foodSize, playerPos[0] + r)) && (between(foodLocations[i]['y'], playerPos[1] - r - foodSize, playerPos[1] + r))) {
      ctx2.clearRect(0, 0, width, height);
      foodLocations.splice(i, 1);
      for (j = 0; j < foodLocations.length; j++) {
        ctx2.fillStyle = "rgb(255, 110, 110)";
        ctx2.strokeStyle = "rgb(0, 0, 0)"
        ctx2.fillRect(foodLocations[j]['x'], foodLocations[j]['y'], foodSize, foodSize);
        ctx2.strokeRect(foodLocations[j]['x'], foodLocations[j]['y'], foodSize, foodSize);
      }
      score++;
      document.getElementById("score").innerHTML = "Score: " + score;
      break;
    }
  }
}

function freezeEnemies() {
  for (i = 0; i < enemies.length; i++) {
    if (enemies[i].drawn) {
      enemies[i].freeze();
    }
  }
}

function spawnBuffer() {
  setTimeout(() => {
    for (i = 0; i < enemies.length; i++) {
      if (enemies[i].drawn) {
        enemies[i].unfreeze();
      }
    }
  }, 1500);
}

function loseLife() {
  lives--;
  document.getElementById("lives").innerHTML = "Lives: " + lives;
  freezeEnemies();
  if (lives == 0) {
    isGameOver = true;
    return;
  }
  spawnBuffer();
}

function displayGameOver() {
  ctx.font = "60px sans-serif";
  ctx.fillStyle = 'red';
  ctx.strokeStyle = 'black';
  ctx.textAlign = 'center';
  ctx.fillText("GAME OVER! Score: " + score, width/2, height/2);
  ctx.strokeText("GAME OVER! Score: " + score, width/2, height/2);
  document.getElementById("restart").style.visibility = 'visible';
}

function restart() {
  isGameOver = false;
  score = 0;
  lives = 3;
  document.getElementById("score").innerHTML = "Score: " + score;
  document.getElementById("lives").innerHTML = "Lives: " + lives;
  // drawPlayer(width/2, height/2, playerRadius);
  playerPos[0] = width/2;
  playerPos[1] = height/2;
  for (i = 0; i < enemies.length; i++) {
    enemies[i].unfreeze();
    enemies[i].position[0] = enemies[i].x;
    enemies[i].position[1] = enemies[i].y;
    enemies[i].drawn = false;
  }
  document.getElementById("restart").style.visibility = 'hidden';
  loop();
}

setInterval(() => {
  drawFood(playerPos[0], playerPos[1], playerRadius)
}, 1000);

let playerSpeed = 5;
function movePlayer() {
  if (keyPressed['ArrowLeft'] || keyPressed['a']) { //left
    drawPlayer(playerPos[0] - playerSpeed, playerPos[1], playerRadius);
    playerPos[0] -= playerSpeed;
  }
  if (keyPressed['ArrowUp'] || keyPressed['w']) { //up
    drawPlayer(playerPos[0], playerPos[1] - playerSpeed, playerRadius);
    playerPos[1] -= playerSpeed;
  }
  if (keyPressed['ArrowRight'] || keyPressed['d']) { //right
    drawPlayer(playerPos[0] + playerSpeed, playerPos[1], playerRadius);
    playerPos[0] += playerSpeed;
  }
  if (keyPressed['ArrowDown'] || keyPressed['s']) { //down
    drawPlayer(playerPos[0], playerPos[1] + playerSpeed, playerRadius);
    playerPos[1] += playerSpeed;
  }
}

function loop() {
  clearCanvas(ctx);
  moveEnemies();
  ctx.fillStyle = "rgb(0, 255, 255)";
  checkBorder(playerRadius);  //radius
  eatFood(playerRadius);
  drawPlayer(playerPos[0], playerPos[1], playerRadius);
  if (!isGameOver) {
    movePlayer();
  } else {
    displayGameOver();
    return;
  }
  window.requestAnimationFrame(loop);
}

loop();

setInterval(() => {
  drawEnemies();
}, 500);

function drawEnemies() {
  if (score >= 5 && !enemies[0].drawn) {
    enemies[0].draw(enemies[0].x, enemies[0].y, enemies[0].r);
    enemies[0].freeze();
    spawnBuffer();
  }
  if (score >= 20 && !enemies[1].drawn) {
    enemies[1].draw(enemies[1].x, enemies[1].y, enemies[1].r);
    enemies[1].freeze();
    spawnBuffer();
  }
  if (score >= 35 && !enemies[2].drawn) {
    enemies[2].draw(enemies[2].x, enemies[2].y, enemies[2].r);
    enemies[2].freeze();
    spawnBuffer();
  }
  if (score >= 50 && !enemies[3].drawn) {
    enemies[3].draw(enemies[3].x, enemies[3].y, enemies[3].r);
    enemies[3].freeze();
    spawnBuffer();
  }
}

function moveEnemies() {
  for (i = 0; i < enemies.length; i++) {
    if (enemies[i].drawn) {
      enemies[i].move();
    }
  }

}
