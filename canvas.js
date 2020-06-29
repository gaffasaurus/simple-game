const canvas = document.querySelector(".myCanvas");
const width = canvas.width = 950;
const height = canvas.height = 550;
const ctx = canvas.getContext("2d");

const canvas2 = document.querySelector(".myCanvas2");
canvas2.width = 950;
canvas2.height = 550;
const ctx2 = canvas2.getContext("2d");

let score = 0;
let lives = 5;

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
function drawCircle(x, y, r) {
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
drawCircle(width/2, height/2, playerRadius);

//create enemies
let enemy1 = new Enemy(100, 100, 30, "rgb(255, 0, 0)", 3, 5);
let enemy2 = new Enemy(100, 100, 40, "rgb(128, 0, 128)", 6, 4);

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
  if (foodLocations.length < 4) {
    ctx2.fillStyle = "rgb(255, 0, 0)";
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
        ctx2.fillStyle = "rgb(255, 0, 0)";
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

function loseLife() {
  lives--;
  document.getElementById("lives").innerHTML = "Lives: " + lives;
}

setInterval(() => {
  drawFood(playerPos[0], playerPos[1], playerRadius)
}, 1000);

let playerSpeed = 3;

function loop() {
  clearCanvas(ctx);
  moveEnemies();
  ctx.fillStyle = "rgb(0, 255, 255)";
  checkBorder(playerRadius);  //radius
  eatFood(playerRadius);
  drawCircle(playerPos[0], playerPos[1], playerRadius);
  if (keyPressed['ArrowLeft']) { //left
    drawCircle(playerPos[0] - playerSpeed, playerPos[1], playerRadius);
    playerPos[0] -= playerSpeed;
  }
  if (keyPressed['ArrowUp']) { //up
    drawCircle(playerPos[0], playerPos[1] - playerSpeed, playerRadius);
    playerPos[1] -= playerSpeed;
  }
  if (keyPressed['ArrowRight']) { //right
    drawCircle(playerPos[0] + playerSpeed, playerPos[1], playerRadius);
    playerPos[0] += playerSpeed;
  }
  if (keyPressed['ArrowDown']) { //down
    drawCircle(playerPos[0], playerPos[1] + playerSpeed, playerRadius);
    playerPos[1] += playerSpeed;
  }
  window.requestAnimationFrame(loop);
}

loop();

setInterval(() => {
  drawEnemies();
}, 500);

function drawEnemies() {
  if (score >= 1 && !enemy1.drawn) {
    enemy1.draw(enemy1.x, enemy1.y, enemy1.r);
  }
  if (score >= 25 && !enemy2.drawn) {
    enemy2.draw(enemy2.x, enemy2.y, enemy2.r);
  }
}

function moveEnemies() {
  if (enemy1.drawn) {
    enemy1.move();
  }
  if (enemy2.drawn) {
    enemy2.move();
  }

}
