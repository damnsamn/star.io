// Global Variables
var w = 800;
var h = 800;
var bg = 0;
var viewScale = 1;
var windowCenter = { x: w / 2, y: h / 2 };
var stars = [];
var starIdCounter = 0;
var starIndexCounter = 0;
var mouseHold;
var player;
var killQueue = [];
var mouse = {};
var frameCount = 0;
let focusStar;

function setup() {
    createCanvas(w, h);
    textSize(16);
    player = new Player(width / 2, height / 2, 10);

    for (let i = 0; i < 100; i++)
        stars.push(new Star(random(-width * 1.5, width * 2.5), random(-height * 1.5, height * 2.5), random(5, 10)));
}

function draw() {
    background(bg);
    translate(width / 2, height / 2)
    scale(viewScale);
    translate(-width / 2, -height / 2);


    // TODO: fix mouse.x and mouse.y

    // translate(width / 2, height / 2);
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
    if (frameCount >= frameRate() / 2) {
        frameCount = 0;
        stars.push(new Star(random(width), random(height), random(5, 10)));
    }
}


// Input Events
function mousePressed() {
    // stars.push(new Star(mouseX + player.x - width / 2, mouseY + player.y - height / 2, random(5, 10)));

    // for (let i = 0; i < 50; i++)
    //     stars.push(new Star(random(width), random(height), random(5, 10)));

    for (let star of stars) {
        if (within(mouseX, star.radius, star.x) && within(mouseY, star.radius, star.y))
            focusStar = star;
    }
    console.log(stars);
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


    // // Bounding box
    // rectMode(CORNER);
    // strokeWeight(2);
    // stroke(255, 0, 0);
    // noFill();
    // rect(1, 1, width - 2, height - 2);


    // Thrust bar
    noStroke();
    fill(player.color);
    rect(0, height - player.thrust * 2, 5, player.thrust * 2);


    // Reticle
    stroke(255);
    noFill();
    line(mouse.x - 5, mouse.y, mouse.x + 5, mouse.y);
    line(mouse.x, mouse.y - 5, mouse.x, mouse.y + 5);
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