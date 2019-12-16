class Star {
    constructor(x, y, radius, c) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.id = starIdCounter;
        starIdCounter++;

        let r = random(50, 255);
        let g = random(50, 255);
        let b = random(50, 255);
        this.color = c || color(r, g, b);

        this.thrustX = 0;
        this.thrustY = 0;
        this.influenceRadius = 0;
        this.updateInfluence();
    }

    setColor(r, g, b) {
        this.color = color(r, g, b)
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
        if (vDistance(this, { x: x, y: y }) <= this.influenceRadius) {
            let diffX = (x - this.x) / this.influenceRadius * scale;
            let diffY = (y - this.y) / this.influenceRadius * scale;
            this.thrustX += diffX;
            this.thrustY += diffY;
        }
    }

    gravitateTo(target) {
        let distance = vDistance(this, target);
        let scale = (target.radius / distance / 0.5);

        if (distance <= target.influenceRadius) {
            let diffX = (target.x - this.x) / target.influenceRadius * scale;
            let diffY = (target.y - this.y) / target.influenceRadius * scale;

            this.thrustX += diffX;
            this.thrustY += diffY;
        }

        if (distance <= target.radius + this.radius) {
            if (target.radius < this.radius) {
                this.consume(target);
            }
            else {
                target.consume(this);

                if (this == focusStar)
                    focusStar = target;
            }
        }
    }

    consume(target) {
        this.radius = this.radius + target.radius * (target.radius / this.radius);
        killQueue.push(target);
        this.updateInfluence();
    }

    destroy() {
        for (let i = 0; i < stars.length; i++) {
            if (stars[i].id == this.id) {
                stars.splice(i, 1);
                break;
            }
        }
    }

    updateInfluence() {
        this.influenceRadius = this.radius * 10;
    }

    draw() {

        // Draw toward center
        this.thrustX += (width/2 - this.x) * this.radius/100/width/100;
        this.thrustY += (height/2 - this.y) * this.radius/100/height/100;


        this.x += this.thrustX;
        this.y += this.thrustY;

        // Influence
        noStroke();
        fill(red(this.color), green(this.color), blue(this.color), 40);
        circle(this.x, this.y, this.influenceRadius * 2);


        // Star
        fill(this.color);
        strokeWeight(2 / viewScale);
        stroke(darken(red(this.color), green(this.color), blue(this.color), 0.6));
        circle(this.x, this.y, this.radius * 2);
    }
}