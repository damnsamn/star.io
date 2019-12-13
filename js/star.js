class Star {

    constructor(x, y, radius, c) {
      this.x = x;
      this.y = y;
      this.radius = radius;
      this.color = c || color(random(100, 255),random(100, 255),random(100, 255));
      this.thrustX = 0;
      this.thrustY = 0;
      this.influenceRadius = radius * 10;

      this.id = starIndex;
      starIndex++;
    }

    setColor(r,g,b) {
      this.color = color(r,g,b)
    }

    move(x, y) {
      let diffX = round(x - this.x);
      let diffY = round(y - this.y);

      this.x += diffX;
      this.y += diffY;
    }

    thrust(x, y, scale) {
      let diffX = (x - this.x) * scale;
      let diffY = (y - this.y) * scale;

      this.thrustX += diffX;
      this.thrustY += diffY;
    }

    gravitate(x, y) {
      let scale = 0.1;
      if(vDistance(this, {x:x,y:y}) <= this.influenceRadius) {
        let diffX = (x - this.x) / this.influenceRadius * scale;
        let diffY = (y - this.y) / this.influenceRadius * scale;
        this.thrustX += diffX;
        this.thrustY += diffY;
      }
    }

    gravitateTo(target) {
      let scale = 0.1;
      if(vDistance(this, {x: target.x, y: target.y}) <= this.influenceRadius) {
        let diffX = (target.x - this.x) / this.influenceRadius * scale;
        let diffY = (target.y - this.y) / this.influenceRadius * scale;
        this.thrustX += diffX;
        this.thrustY += diffY;
      }

    }

    draw() {
      this.x += this.thrustX;
      this.y += this.thrustY;

      if (this.x > width || this.x < 0 || this.y > height || this.y < 0) {
        // DESTROY THE STAR
      }

      // Influence
      noStroke();
      fill(red(this.color), green(this.color), blue(this.color), 50);
      circle(this.x, this.y, this.influenceRadius*2);


      // Star
      fill(this.color);
      strokeWeight(2);
      stroke(darken(red(this.color), green(this.color), blue(this.color), 0.6));
      circle(this.x, this.y, this.radius*2);
    }
  }