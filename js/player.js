class Player extends Star {



    thrust() {
        let distance = vDistance(this, mouse);
        let scale = (this.radius / distance / 0.5);

        let diffX = (mouse.x - this.x) / this.influenceRadius * scale;
        let diffY = (mouse.y - this.y) / this.influenceRadius * scale;

        stroke(255 - red(this.color), 255 - green(this.color), 255 - blue(this.color))
        line(this.x, this.y, this.x + diffX / scale * viewScale, this.y + diffY / scale * viewScale);

        this.thrustX += diffX;
        this.thrustY += diffY;
    }
}