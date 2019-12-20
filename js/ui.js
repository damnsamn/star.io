var frames = [];
class UserInterface {
    constructor() {
        this.score = 0;
        this.vw = width / viewScale;
        this.vh = height / viewScale;
        this.color = color(255);
        this.thrustIndicatorX = 0;
        this.thrustIndicatorY = 0;
        this.warnings = [];
        this.starGraph = new Graph(0, 250, 300, 100);
    }

    draw() {
        this.vw = width / viewScale;
        this.vh = height / viewScale;


        this.color = color(lighten(red(focusStar.color), green(focusStar.color), blue(focusStar.color), 0.6));

        // Reticle
        stroke(this.color);
        noFill();
        strokeWeight(1 / viewScale)
        circle(mouse.x, mouse.y, 20 / viewScale)
        fill(this.color);
        noStroke();
        circle(mouse.x, mouse.y, 3 / viewScale)

        // Translate for view-relative UI;
        translate(focusStar.x - focusStar.thrustX / 2 - width / viewScale / 2, focusStar.y - focusStar.thrustY / 2 - height / viewScale / 2);

        stroke(this.color);
        strokeWeight(1.5 / viewScale)

        // Velocity Display
        push();
        let boxSize = 100 / viewScale;
        translate(25 / viewScale, 25 / viewScale);
        stroke(this.color);
        // Grid
        let n = 5;
        this.thrustIndicatorX -= focusStar.thrustX / 10;
        this.thrustIndicatorY -= focusStar.thrustY / 10;
        this.thrustIndicatorX = this.thrustIndicatorX < 0 ? boxSize / n : this.thrustIndicatorX > boxSize / n ? 0 : this.thrustIndicatorX;
        this.thrustIndicatorY = this.thrustIndicatorY < 0 ? boxSize / n : this.thrustIndicatorY > boxSize / n ? 0 : this.thrustIndicatorY;
        for (let i = 0; i < n; i++) {
            line(boxSize / n * i + this.thrustIndicatorX, 0, boxSize / n * i + this.thrustIndicatorX, boxSize);
            line(0, boxSize / n * i + this.thrustIndicatorY, boxSize, boxSize / n * i + this.thrustIndicatorY);
        }

        fill(0, 0, 0, 100);
        stroke(this.color);
        rect(0, 0, boxSize, boxSize);

        fill(this.color);
        noStroke()
        circle(boxSize / 2, boxSize / 2, 10 / viewScale);
        pop();

        // Score
        noStroke();
        fill(this.color);
        textAlign(LEFT);
        textSize(14 / viewScale);
        text(`Score: ${round(focusStar.radius)}`, 150 / viewScale, 25 / viewScale, 0);

        // Debug Info
        fill(255, 255, 0);
        stroke(0);
        strokeWeight(2 / viewScale);
        textAlign(RIGHT);
        text(round(getAvgFrameRate()), (width - 25) / viewScale, 25 / viewScale);
        text(`${stars.length} total`, (width - 25) / viewScale, 50 / viewScale);


        for (let warning of this.warnings) {
            warning.draw();
        }
        if (frameCount % 30 == 0)
            this.starGraph.plot(stars.length);
        this.starGraph.draw((width - 325) / viewScale, (height - 125) / viewScale);

    }

    addWarning(star) {
        this.warnings.push(new UIWarning(star));
    }

    removeWarning(star) {
        for (let i = 0; i < this.warnings.length; i++) {
            if (this.warnings[i].id == star.id) {
                this.warnings.splice(i, 1)
                break;
            }
        }
    }

    getWarnings() {

    }
}

class UIWarning {
    constructor(star) {
        this.star = star;
        this.color = this.star.color;
        this.id = this.star.id;
    }

    draw() {
        // TODO - this is shit
        let hyp = sqrt(sq(this.star.x - focusStar.x) + sq(this.star.y - focusStar.y));

        let diffX = ((width - 50) / 2 / viewScale) / hyp;
        let diffY = ((height - 50) / 2 / viewScale) / hyp;
        let constrainedX = diffX * (this.star.x - focusStar.x);
        let constrainedY = diffY * (this.star.y - focusStar.y);


        push();
        translate(constrainedX + UI.vw / 2, constrainedY + UI.vh / 2);
        fill(this.color);
        noStroke();

        let a = atan2((this.star.y - focusStar.y), (this.star.x - focusStar.x))
        rotate(a + PI / 2);
        triangle(0, 0, 7 / viewScale, 7 / viewScale, -7 / viewScale, 7 / viewScale);
        pop();


        // circle(constrainedX + UI.vw/2, constrainedY + UI.vh/2, 10/viewScale);
    }
}

function getAvgFrameRate() {
    // Draw framerate (over 60 frames)
    let avgLimit = 60;
    if (frames.length < avgLimit) {
        frames.push(round(frameRate()));
    } else if (frames.length == avgLimit) {
        frames.splice(0, 1);
        append(frames, round(frameRate()));
    }
    let avgFrameRate = 0;
    frames.forEach(function (i) {
        avgFrameRate += i;
    });
    avgFrameRate = round(avgFrameRate / frames.length);
    return avgFrameRate;
}

class Graph {
    constructor(min, max, width, height) {
        this.min = min;
        this.max = max;
        this.w = width;
        this.h = height;
        this.xScale = 60;
        this.updateDimensions();


        this.values = [0]
    }

    plot(val) {
        this.values.push(val);

        if (this.values.length > this.xScale)
            this.values.shift();
    }

    updateDimensions() {
        this.width = this.w / viewScale;
        this.height = this.h / viewScale;

        this.yStep = this.max / this.height;
        this.xStep = this.width / this.xScale;
    }

    draw(x, y) {
        this.updateDimensions();
        push();
        translate(x, y);

        stroke(UI.color);
        let xAxis = line(0, this.height, this.width, this.height)
        let yAxis = line(0, 0, 0, this.height);

        textAlign(RIGHT);
        noStroke();
        fill(UI.color);
        let yMax = text(this.max, 0, 0, 0);
        let yMin = text(0, 0, this.height, 0);

        if (this.values.length > 1)
            for (let i = 0; i < this.values.length; i++) {
                let lastValX = stars[i - 1] ? this.width - this.xStep * (this.values.length - i) : 0;
                let lastValY = stars[i - 1] ? this.height - (this.values[i - 1] / this.yStep) : this.height - (this.values[i] / this.yStep);
                let valX = lastValX + this.xStep;
                let valY = this.height - (this.values[i] / this.yStep);
                stroke(255);
                strokeWeight(1.5 / viewScale)
                line(lastValX, lastValY, valX, valY);
                // debugger;
            }

        pop();
    }
}