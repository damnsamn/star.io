class Player {

    constructor(x, y, size, c) {
        this.x = x;
        this.y = y;
        this.size = size;
        this.color = c || color(random(100, 255), random(100, 255), random(100, 255));
        this.thrust = 0;
        this.thrustX = 0;
        this.thrustY = 0;
        this.influenceRadius = size/2 * 10;

        this.id = starIndex;
        starIndex++;
    }

    draw() {
        this.x += this.thrustX;
        this.y += this.thrustY;
        this.y -= this.thrust/10;

        // push();
        translate(windowCenter.x - this.x, windowCenter.y - this.y);

        if (this.x > width || this.x < 0 || this.y > height || this.y < 0) {
            // DESTROY THE STAR
        }

        // Influence
        noStroke();
        fill(red(this.color), green(this.color), blue(this.color), 50);
        circle(this.x, this.y, this.influenceRadius * 2);

        // Thruster
        rectMode(CENTER);
        rect(this.x, this.y + this.size/2, this.size/1.5, 5);
        line(this.x, this.y, mouseX, mouseY)


        // Star
        fill(this.color);
        strokeWeight(2);
        stroke(darken(red(this.color), green(this.color), blue(this.color), 0.6));
        circle(this.x, this.y, this.size);
    }
}