// Global Variables
var w = 800;
var h = 800;
var bg = 10;
var viewScale = 1;
var windowCenter = { x: w / 2, y: h / 2 };
var stars = [];
var starIdCounter = 0;
var starIndexCounter = 0;
var starBorder = 2;
var mouseHold;
var player;
var lastTouch;
var killQueue = [];
var mouse = {};
var frameCount = 0;
var spawnArena = { w: w * 20, h: h * 20 }
var focusStar;
var zoomTarget;
var zoomCounter = 0;
var win, lose;

var UI;

function setup() {
    createCanvas(w, h);
    textSize(16);
    player = new Player(width / 2, height / 2, 10);
    UI = new UserInterface();
    zoomTarget = viewScale;

    for (let i = 0; i < 100; i++)
        stars.push(new Star(random(-spawnArena.w / 2 + width / 2, spawnArena.w / 2 + width / 2), random(-spawnArena.h / 2 + height / 2, spawnArena.h / 2 + height / 2), random(5, 10)));



    focus(stars[0]);
}

function draw() {
    background(bg);

    translate(width / 2, height / 2)
    scale(viewScale);
    zoom(zoomTarget);
    translate(-width / 2, -height / 2);
    setMouse();

    // Draw Game Objects
    // player.draw();
    firingSquad();

    if (focusStar)
        translate(windowCenter.x - focusStar.x, windowCenter.y - focusStar.y);



    fill(0);
    circle(0, 0, 500);


    if (stars.length) {
        for (n = 0; n < stars.length; n++) {
            let focussed = stars[n] === focusStar;
            if (stars[n])
                for (i = 0; i < stars.length; i++) {
                    if (stars[i] != stars[n] && stars[i])
                        stars[n].gravitateTo(stars[i])

                    // Alert to nearby Big Bois
                    // TODO
                    if (focussed && stars[i].radius > 1.5 * stars[n].radius && within(stars[i].x, width / viewScale, stars[n].x) && within(stars[i].y, height / viewScale, stars[n].y) && !within(stars[i].x, width / 2 / viewScale, stars[n].x) && !within(stars[i].y, height / 2 / viewScale, stars[n].y)) {
                        stroke(255)
                        line(stars[n].x, stars[n].y, stars[i].x, stars[i].y);
                        console.log("alert")
                    }
                }

            if (stars[n])
                stars[n].draw();
        }
    }





    if (mouseHold && !win && !lose) {
        if (focusStar)
            focusStar.thrust()
    }

    UI.draw();

    frameCount++;
    if (frameCount >= frameRate() / 2) {
        frameCount = 0;
        stars.push(new Star(random(-spawnArena.w / 2, spawnArena.w / 2), random(-spawnArena.h / 2, spawnArena.h / 2), random(5, 10)));
    }

    if (lose) {
        let c = focusStar.color;
        c.setAlpha(50);
        fill(c)
        rect(0, 0, width / viewScale, height / viewScale);
    }

}


// Input Events
function mousePressed() {
    // stars.push(new Star(mouseX + player.x - width / 2, mouseY + player.y - height / 2, random(5, 10)));

    // for (let i = 0; i < 50; i++)
    //     stars.push(new Star(random(width), random(height), random(5, 10)));

    for (let star of stars) {
        if (within(mouse.x, star.radius + starBorder / viewScale, star.x) && within(mouse.y, star.radius + starBorder / viewScale, star.y)) {
            // focus(star);
            UI.addWarning(star);
        }
    }
    mouseHold = true;
}

function mouseReleased() {
    mouseHold = false;
}

function mouseWheel(event) {
    let scale = 1.1;
    if (event.delta < 0)
        zoomTarget *= scale;
    else if (event.delta > 0)
        zoomTarget /= scale;

    // viewScale = constrain(viewScale + change, 0, 1);
    return false;
}

function touchMoved(event) {
    if (touches.length) {
        let scale = 1.1;

        let newTouch = touches[0];

        if (lastTouch && lastTouch.y) {
            if (newTouch.y < lastTouch.y)
                zoomTarget *= scale;
            else
                zoomTarget /= scale;
        }

        lastTouch = newTouch;
    }
}

// Helper functions
function darken(r, g, b, s) {
    s = constrain(s, 0, 1);
    r = s * r;
    g = s * g;
    b = s * b;

    return color(r, g, b);
}

function lighten(r, g, b, s) {
    s = constrain(s, 0, 1);
    r = 255 - (255 - r / s)
    g = 255 - (255 - g / s)
    b = 255 - (255 - b / s)

    return color(r, g, b);
}

function vDistance(point, target) {
    let distX = abs(target.x - point.x);
    let distY = abs(target.y - point.y);
    return sqrt(sq(distX) + sq(distY));
}


function drawStars(starsArray) {
    for (let star in starsArray)
        if (star)
            star.draw();
}

function within(a, n, b) {
    return (a >= b - n && a <= b + n);
}

function firingSquad() {
    killQueue.forEach(function (star) {
        star.destroy();
    })
    killQueue = [];
}

function setMouse() {
    mouse.x = mouseX / viewScale - width / viewScale / 2 + width / 2;
    mouse.y = mouseY / viewScale - height / viewScale / 2 + height / 2;

    if (focusStar) {
        mouse.x -= windowCenter.x - focusStar.x;
        mouse.y -= windowCenter.y - focusStar.y;
    }
}

function focus(star) {
    if (focusStar)
        focusStar.resetColor();
    star.setColor()
    focusStar = star;
    console.log(focusStar);
}

function zoom(target) {
    let diff = target - viewScale;

    viewScale += diff * 0.1;

    if (within(target, 0.001, viewScale))
        viewScale = target;
}