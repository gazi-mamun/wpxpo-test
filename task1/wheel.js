class Wheel {
  constructor(
    canvas,
    data,
    colors,
    primaryColor,
    contrastColor,
    size,
    centerX,
    centerY,
    wheelSpeed,
    friction
  ) {
    this.canvas = canvas;
    this.canvasContext = canvas.getContext("2d");
    this.data = data;
    this.colors = colors;
    this.primaryColor = primaryColor;
    this.contrastColor = contrastColor;

    this.size = size;
    this.centerX = centerX;
    this.centerY = centerY;

    this.currentAngle = 0;
    this.PI2 = Math.PI * 2;
    this.wheelSpeed = wheelSpeed;
    this.friction = friction;

    this.reserveColor = "#a8ccd7 ";
  }

  calculate(startAngle) {
    let value = startAngle % this.PI2;

    if (value > this.data.length) {
      value = value - this.PI2;
    }

    if (value > 0) {
      value = this.PI2 - value;
    }

    if (this.data.length === 1) return this.data[0];

    const anglePerSlice = this.PI2 / this.data.length;

    if (value >= 0 && value <= anglePerSlice) return this.data[0];

    for (let i = 2; i <= this.data.length; i++) {
      if (value > anglePerSlice * (i - 1) && value <= anglePerSlice * i)
        return this.data[i - 1];
    }
    return this.data[0];
  }

  detSegFontSize() {
    let fs = 10;

    if (this.size < 120) fs = 10;
    else if (this.size < 150) fs = 14;
    else if (this.size < 200) fs = 16;
    else fs = 18;

    let repeat5 = Math.round(this.data.length / 5);

    while (repeat5) {
      if (fs <= 5) {
        break;
      }
      fs--;
      repeat5--;
    }

    return fs;
  }

  drawSegment(key, startAngle, endAngle) {
    const ctx = this.canvasContext;
    const value = this.data[key];
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(this.centerX, this.centerY);
    ctx.arc(this.centerX, this.centerY, this.size, startAngle, endAngle, false);
    ctx.lineTo(this.centerX, this.centerY);
    ctx.closePath();

    if (key % this.colors.length == 0 && key == this.data.length - 1) {
      ctx.fillStyle = this.reserveColor;
    } else {
      ctx.fillStyle = this.colors[key % this.colors.length];
    }

    ctx.fill();
    ctx.stroke();
    ctx.save();
    ctx.translate(this.centerX, this.centerY);
    ctx.rotate((startAngle + endAngle) / 2);
    ctx.fillStyle = this.contrastColor;
    ctx.font = `${this.detSegFontSize()}px Roboto`;
    ctx.fillText(value.substr(0, 21), this.size / 2 + 20, 0);
    ctx.restore();
  }

  drawWheel() {
    const ctx = this.canvasContext;
    const len = this.data.length;
    ctx.lineWidth = 1;
    ctx.strokeStyle = this.primaryColor;
    ctx.textBaseline = "middle";
    ctx.textAlign = "center";

    const anglePerSlice = this.PI2 / this.data.length;
    let startAngle = this.currentAngle;

    for (let i = 0; i < len; i++) {
      let endAngle = startAngle + anglePerSlice;
      this.drawSegment(i, startAngle, endAngle);
      startAngle = endAngle;
    }

    ctx.beginPath();
    ctx.arc(this.centerX, this.centerY, this.size * 0.2, 0, this.PI2, false);
    ctx.closePath();
    ctx.fillStyle = this.primaryColor;
    ctx.lineWidth = 5;
    ctx.strokeStyle = this.contrastColor;
    ctx.fill();
    ctx.fillStyle = this.contrastColor;
    ctx.stroke();
  }

  drawNeedle() {
    const ctx = this.canvasContext;

    ctx.lineWidth = 5;
    const needleWidth = this.size > 140 ? 25 : 20;
    const needleHeight = this.size > 140 ? 15 : 10;

    ctx.shadowColor = "#00000033";
    ctx.shadowBlur = 10;
    ctx.shadowOffsetX = 6;
    ctx.shadowOffsetY = 6;

    ctx.strokeStyle = "black";
    ctx.fillStyle = this.contrastColor;
    ctx.beginPath();
    ctx.moveTo(
      this.centerX + this.size + needleWidth,
      this.centerY + needleHeight
    );
    ctx.lineTo(
      this.centerX + this.size + needleWidth,
      this.centerY - needleHeight
    );
    ctx.lineTo(this.centerX + this.size - needleWidth, this.centerY);
    ctx.closePath();
    ctx.stroke();
    ctx.fill();
    ctx.shadowBlur = 0;
    ctx.shadowColor = "transparent";
  }

  clear() {
    const ctx = this.canvasContext;
    ctx.clearRect(0, 0, 1000, 800);
  }

  draw() {
    this.clear();
    this.drawWheel();
    this.drawNeedle();
  }

  randomIntFromInterval(min, max) {
    // min and max included
    return Math.random() * (max - min + 1) + min;
  }

  spin() {
    return new Promise((resolve, reject) => {
      const random = this.randomIntFromInterval(0, 1);
      const mass = 5000;

      let speed = this.wheelSpeed + random;
      const downAcc = this.friction / mass;

      speed = speed * 0.01;

      const downInterval = setInterval(() => {
        this.currentAngle += speed;
        speed = speed - downAcc;
        this.draw();

        if (speed <= 0) {
          clearInterval(downInterval);
          resolve(this.calculate(this.currentAngle));
        }
      }, 1);

      //
    });
  }

  drawCurve(spx, spy) {
    const ctx = this.canvasContext;

    ctx.lineCap = "round";

    ctx.beginPath();
    ctx.moveTo(spx, spy);

    const midPoint = this.centerX + (spx - this.centerX) / 2;

    ctx.quadraticCurveTo(
      midPoint,
      this.centerY + 10,
      this.centerX,
      this.centerY
    );
    ctx.stroke();

    ctx.save();
    ctx.beginPath();
    ctx.moveTo(this.centerX, this.centerY);
    ctx.lineTo(this.centerX + 20, this.centerY + 20);
    ctx.stroke();
    ctx.save();

    ctx.beginPath();
    ctx.moveTo(this.centerX, this.centerY);
    ctx.lineTo(this.centerX + 20, this.centerY - 20);
    ctx.stroke();
  }
}
