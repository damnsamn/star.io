class Star {
    constructor(x, y, radius, c) {

        this.x = x;
        this.y = y;
        this.radius = radius;
        this.id = starIdCounter;
        starIdCounter++;
        this.color = c || color("#999");

        this.thrustX = 0;
        this.thrustY = 0;
        this.influenceRadius = 0;
        this.updateInfluence();
    }

    setColor(r, g, b) {
        let cr = random(50, 255);
        let cg = random(50, 255);
        let cb = random(50, 255);
        if (!r && !g && !b)
            this.color = color(cr, cg, cb)
        else
            this.color = color(r, g, b)
    }

    resetColor() {
        this.color = color("#999")
    }

    move(x, y) {
        let diffX = round(x - this.x);
        let diffY = round(y - this.y);

        this.x += diffX;
        this.y += diffY;
    }

    thrust() {
        let distance = vDistance(this, mouse);
        let scale = (this.radius / distance / 0.5);

        let diffX = (mouse.x - this.x) / this.influenceRadius * scale;
        let diffY = (mouse.y - this.y) / this.influenceRadius * scale;

        stroke(lighten(red(this.color), green(this.color), blue(this.color), 0.6))
        line(this.x, this.y, this.x + diffX / scale * viewScale, this.y + diffY / scale * viewScale);

        this.thrustX += diffX;
        this.thrustY += diffY;
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

                if (this == focusStar) {
                    focusStar.thrustX = 0;
                    focusStar.thrustY = 0;
                }
            }
        }
    }

    consume(target) {
        let increase = target.radius * (target.radius / this.radius);
        if (this === focusStar) {
            let ratio = (this.radius + increase) / this.radius;
            zoomTarget /= ratio;
        }

        if (target === focusStar) {
            lose = true;
        }
        this.radius = this.radius + increase;


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
        this.thrustX += (width / 2 - this.x) * this.radius / 100 / width / 100;
        this.thrustY += (height / 2 - this.y) * this.radius / 100 / height / 100;


        this.x += this.thrustX / 2;
        this.y += this.thrustY / 2;

        // Influence
        noStroke();
        fill(red(this.color), green(this.color), blue(this.color), 40);
        circle(this.x, this.y, this.influenceRadius * 2);


        // Star
        strokeWeight(starBorder / viewScale);
        stroke(darken(red(this.color), green(this.color), blue(this.color), 0.6));
        fill(this.color);
        circle(this.x, this.y, this.radius * 2);

        // Draw approx. trajectory;
        strokeWeight(2 / viewScale);
        stroke(darken(red(this.color), green(this.color), blue(this.color), 0.6));
        line(this.x, this.y, this.x + this.thrustX * 3, this.y + this.thrustY * 3)
    }
}