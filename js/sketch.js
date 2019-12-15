// Global Variables
var w = 800;
var h = 800;
var bg = 0;
var viewScale = 1;
var windowCenter = { x: w / 2, y: h / 2 };
var stars = [];
var starIndex = 0;
var mouseHold;
var player;
var mouse = {};

function setup() {
    createCanvas(w, h);
    textSize(16);
    player = new Player(width / 2, height / 2, 10);
}

function draw() {
    background(bg);
    translate(width/2, height/2)
    scale(viewScale);
    translate(-width/2, -height/2);

    // translate(width / 2, height / 2);
    // Draw Game Objects
    player.draw();

    if (stars.length) {
        for (n = 0; n < stars.length; n++) {
            if (stars[n]) {

                for (i = 0; i < stars.length; i++) {
                    if (stars[i] != stars[n] && stars[i])
                        stars[n].gravitateTo(stars[i])
                }
                stars[n].draw();

            }
        }
    }


    if (mouseHold) {
    }

    drawUI();
}


// Input Events
function mousePressed() {
    stars.push(new Star(mouseX + player.x - width / 2, mouseY + player.y - height / 2, random(5, 10)));
    console.log(stars);
    mouseHold = true;
}

function mouseReleased() {
    mouseHold = false;
}

function mouseWheel(event) {
    let change = 0;
    if (event.delta < 0)
        change += 0.05;
    else if (event.delta > 0)
        change -= 0.05;

    viewScale = constrain(viewScale + change, 0.25, 1);
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



    rectMode(CORNER);
    strokeWeight(2);
    stroke(255, 0, 0);
    noFill();
    rect(1, 1, width - 2, height - 2);


    noStroke();
    fill(player.color);
    rect(0, height - player.thrust * 2, 5, player.thrust * 2);

    stroke(255);
    noFill();
    line(mouseX - 5, mouseY, mouseX + 5, mouseY);
    line(mouseX, mouseY - 5, mouseX, mouseY + 5);
}

function within(a, n, b) {


    return (a >= b-n && a <= b+n);
}