const canvas = document.querySelector(".myCanvas");
const width = canvas.width = 950;
const height = canvas.height = 550;
const ctx = canvas.getContext("2d");

function degToRad(degrees) {
  return degrees * Math.PI / 180;
}

function clearCanvas() {
  ctx.fillStyle = "rgb(255, 200, 200)";
  ctx.fillRect(0, 0, width, height);
}

clearCanvas();

const circlePos = [];
function drawCircle(x, y, r) {
  ctx.fillStyle = "rgb(0, 255, 255)";
  ctx.beginPath();
  ctx.arc(x, y, r, degToRad(0), degToRad(360), false);
  ctx.fill();
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

  ctx.strokeStyle = "rgb(0, 0, 0)";
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

function moveCircle() {
  clearCanvas();
  ctx.fillStyle = "rgb(0, 255, 255)";
  checkBorder(30);
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
