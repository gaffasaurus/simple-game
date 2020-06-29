const canvas = document.querySelector(".myCanvas");
const width = canvas.width = 950;
const height = canvas.height = 550;
const ctx = canvas.getContext("2d");

const canvas2 = document.querySelector(".myCanvas2");
canvas2.width = 950;
canvas2.height = 550;
const ctx2 = canvas2.getContext("2d");

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

const circlePos = [];
function drawCircle(x, y, r) {
  ctx.fillStyle = "rgb(0, 255, 255)";
  ctx.strokeStyle = "rgb(0, 0, 0)";

  ctx.beginPath();
  ctx.arc(x, y, r, degToRad(0), degToRad(360), false);
  ctx.fill();
  ctx.stroke();
  circlePos.push(x);
  circlePos.push(y);
  circlePos.push(r);

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


ctx.fillStyle = "rgb(0, 255, 255)";
drawCircle(width/2, height/2, 30);

let keyPressed = {};

document.addEventListener('keydown', e => {
  keyPressed[e.key] = true;
});
document.addEventListener('keyup', e => {
  keyPressed[e.key] = false;
});

function checkBorder(r) {
  if (circlePos[0] - r <= 0) {
    circlePos[0] = r;
  }
  if (circlePos[0] + r >= width) {
    circlePos[0] = width - r;
  }
  if (circlePos[1] - r <= 0) {
    circlePos[1] = r;
  }
  if (circlePos[1] + r >= height) {
    circlePos[1] = height - r;
  }
}

let foodLocations = [];
function drawFood(circleX, circleY, circleR) {
  if (foodLocations.length < 4) {
    ctx2.fillStyle = "rgb(255, 0, 0)";
    ctx2.strokeStyle = "rgb(0, 0, 0)";

    let x = Math.floor(Math.random() * (width - 20)) + 10;
    while (between(x + 10, circleX - circleR, circleX + circleR)) {
      x = Math.floor(Math.random() * (width - 20)) + 10;
    }

    let y = Math.floor(Math.random() * (height - 20)) + 10;
    while (between(y + 10, circleY - circleR, circleY + circleR)) {
      y = Math.floor(Math.random() * (height - 20)) + 10;
    }
    console.log(x + ", " + y);
    ctx2.fillRect(x, y, 10, 10);
    foodLocations.push({
      x: x,
      y: y
    });
  }
}

setInterval(() => {
  drawFood(circlePos[0], circlePos[1], 30)
}, 1000);

function moveCircle() {
  clearCanvas(ctx);
  ctx.fillStyle = "rgb(0, 255, 255)";
  checkBorder(30);  //radius
  eatFood(30);
  drawCircle(circlePos[0], circlePos[1], 30);
  if (keyPressed['ArrowLeft']) { //left
    drawCircle(circlePos[0] - 3, circlePos[1], 30);
    circlePos[0] -= 3;
  }
  if (keyPressed['ArrowUp']) { //up
    drawCircle(circlePos[0], circlePos[1] - 3, 30);
    circlePos[1] -=3;
  }
  if (keyPressed['ArrowRight']) { //right
    drawCircle(circlePos[0] + 3, circlePos[1], 30);
    circlePos[0] +=3;
  }
  if (keyPressed['ArrowDown']) { //down
    drawCircle(circlePos[0], circlePos[1] + 3, 30);
    circlePos[1] +=3;
  }
  window.requestAnimationFrame(moveCircle);
}

moveCircle();

function eatFood(r) {
  for (i = 0; i < foodLocations.length; i++) {
    if (between(foodLocations[i]['x'], circlePos[0] - r, circlePos[0] + r) && (between(foodLocations[i]['y'], circlePos[1] - r, circlePos[1] + r))) {
      ctx2.clearRect(0, 0, width, height);
      foodLocations.splice(i, 1);
      for (j = 0; j < foodLocations.length; j++) {
        ctx2.fillStyle = "rgb(255, 0, 0)";
        ctx2.fillRect(foodLocations[j]['x'], foodLocations[j]['y'], 10, 10);
      }
      break;
    }
  }
}
