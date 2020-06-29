class Enemy {

  constructor(x, y, r, color, xSpeed, ySpeed) {
    this.x = x;
    this.y = y;
    this.r = r;
    this.color = color;
    this.xSpeed = xSpeed;
    this.ySpeed = ySpeed;
    this.position = [x, y];
    this.drawn = false;
    this.frozen = false;
  }

  draw(x, y, r) {
    this.drawn = true;
    ctx.fillStyle = this.color;
    ctx.strokeStyle = "rgb(0, 0, 0)";
    ctx.beginPath();
    ctx.arc(x, y, r, degToRad(0), degToRad(360), false);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = "rgb(0, 0, 0)"

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

    ctx.beginPath();
    ctx.moveTo(x - r/2 - 5, y - r/6 - 12);
    ctx.lineTo(x - r/3, y - r/6 - 6);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(x + r/2 + 5, y - r/6 - 12);
    ctx.lineTo(x + r/3, y - r/6 - 6);
    ctx.stroke();
  }

  checkBorder() {
    if (this.position[0] - this.r <= 0) {
      this.position[0] = this.r;
      this.xSpeed *= -1;
    }
    if (this.position[0] + this.r >= width) {
      this.position[0] = width - this.r;
      this.xSpeed *= -1;
    }
    if (this.position[1] - this.r <= 0) {
      this.position[1] = this.r;
      this.ySpeed *= -1;
    }
    if (this.position[1] + this.r >= height) {
      this.position[1] = height - this.r;
      this.ySpeed *= -1;
    }
  }

  square(x) {
    return x * x;
  }

  distance(x1, y1, x2, y2) {
    return Math.sqrt(this.square(x2 - x1) + this.square(y2 - y1));
  }

  checkCollision() {
    if (this.distance(this.position[0], this.position[1], playerPos[0], playerPos[1]) < this.r + playerRadius) {
      this.position[0] = this.x;
      this.position[1] = this.y;
      playerPos[0] = width/2;
      playerPos[1] = height/2;
      loseLife();
    }
  }

  move() {
    ctx.fillStyle = this.color;
    this.checkBorder();
    this.checkCollision();
    if (!this.frozen) {
      this.draw(this.position[0] + this.xSpeed, this.position[1] + this.ySpeed, this.r);
      this.position[0] += this.xSpeed;
      this.position[1] += this.ySpeed;
    } else {
      this.draw(this.position[0], this.position[1] + this.ySpeed, this.r);
    }
  }

  freeze() {
    this.frozen = true;
  }

  unfreeze() {
    this.frozen = false;
  }
}
