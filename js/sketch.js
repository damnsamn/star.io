// Global Variables
var w = 800;
var h = 800;
var bg = 0;
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
var spawnArena = { w: w * 10, h: h * 10}
let focusStar;

function setup() {
    createCanvas(w, h);
    textSize(16);
    frameRate(60);
    player = new Player(width / 2, height / 2, 10);

    for (let i = 0; i < 100; i++)
        stars.push(new Star(random(-spawnArena.w / 2 + width/2, spawnArena.w / 2 + width/2), random(-spawnArena.h / 2 + height/2, spawnArena.h / 2 + height/2), random(5, 10)));
}

function draw() {
    background(bg);
    translate(width / 2, height / 2)
    scale(viewScale);
    translate(-width / 2, -height / 2);

    setMouse();

    // Draw Game Objects
    // player.draw();
    firingSquad();

    if (focusStar)
        translate(windowCenter.x - focusStar.x, windowCenter.y - focusStar.y);


    if (stars.length) {
        for (n = 0; n < stars.length; n++) {

            if (stars[n])
                for (i = 0; i < stars.length; i++) {
                    if (stars[i] != stars[n] && stars[i])
                        stars[n].gravitateTo(stars[i])
                }

            if (stars[n])
                stars[n].draw();
        }
    }





    if (mouseHold) {
    }

    drawUI();

    frameCount++;
    if (frameCount >= frameRate() * 1) {
        frameCount = 0;
        stars.push(new Star(random(-spawnArena.w / 2, spawnArena.w / 2), random(-spawnArena.h / 2, spawnArena.h / 2), random(5, 10)));
    }
}


// Input Events
function mousePressed() {
    // stars.push(new Star(mouseX + player.x - width / 2, mouseY + player.y - height / 2, random(5, 10)));

    // for (let i = 0; i < 50; i++)
    //     stars.push(new Star(random(width), random(height), random(5, 10)));

    for (let star of stars) {
        if (within(mouse.x, star.radius + starBorder/viewScale, star.x) && within(mouse.y, star.radius + starBorder/viewScale, star.y)) {
            focusStar = star;
            console.log(focusStar);
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
        viewScale *= scale;
    else if (event.delta > 0)
        viewScale /= scale;

    // viewScale = constrain(viewScale + change, 0, 1);
    return false;
}

function touchMoved(event) {
    if (touches.length) {
        let scale = 1.1;

        let newTouch = touches[0];

        if (lastTouch && lastTouch.y) {
            if (newTouch.y < lastTouch.y)
                viewScale *= scale;
            else
                viewScale /= scale;
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

function drawUI() {
    translate(player.x - width / 2, player.y - height / 2);


    // Bounding box
    rectMode(CORNER);
    strokeWeight(starBorder);
    stroke(255, 0, 0);
    noFill();
    rect(1, 1, width - 2, height - 2);


    // Thrust bar
    noStroke();
    fill(player.color);
    rect(0, height - player.thrust * 2, 5, player.thrust * 2);


    // Reticle
    stroke(255);
    noFill();

    strokeWeight(1 / viewScale)
    circle(mouse.x, mouse.y, 20/viewScale)
    fill(255);
    noStroke();
    circle(mouse.x, mouse.y, 3/viewScale)
    // line(mouse.x - 5 / viewScale, mouse.y, mouse.x + 5 / viewScale, mouse.y);
    // line(mouse.x, mouse.y - 5 / viewScale, mouse.x, mouse.y + 5 / viewScale);
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