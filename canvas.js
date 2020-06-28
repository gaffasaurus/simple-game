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
  ctx.beginPath();
  ctx.arc(x, y, r, degToRad(0), degToRad(360), false);
  ctx.fill();
  circlePos.push(x);
  circlePos.push(y);
  circlePos.push(r);
}

ctx.fillStyle = "rgb(0, 255, 255)";
drawCircle(width/2, height/2, 30);

window.addEventListener('keydown', function(e) {
  key = e.keyCode;
  clearCanvas()
  ctx.fillStyle = "rgb(0, 255, 255)";
  if (key == 37) { //left
    drawCircle(circlePos[0] - 7, circlePos[1], 30);
    circlePos[0] -= 7;
  } else if (key == 38) { //up
    drawCircle(circlePos[0], circlePos[1] - 7, 30);
    circlePos[1] -=7;
  } else if (key == 39) { //right
    drawCircle(circlePos[0] + 7, circlePos[1], 30);
    circlePos[0] +=7
  } else if (key == 40) { //down
    drawCircle(circlePos[0], circlePos[1] + 7, 30);
    circlePos[1] +=7
  }
})
