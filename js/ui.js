
function drawUI() {
    let uiColor = color(lighten(red(focusStar.color), green(focusStar.color), blue(focusStar.color), 0.6));

    // Reticle
    stroke(uiColor);
    noFill();
    strokeWeight(1 / viewScale)
    circle(mouse.x, mouse.y, 20 / viewScale)
    fill(uiColor);
    noStroke();
    circle(mouse.x, mouse.y, 3 / viewScale)

    // Translate for view-relative UI;

    translate(focusStar.x - focusStar.thrustX / 2 - width / viewScale / 2, focusStar.y - focusStar.thrustY / 2 - height / viewScale / 2);

    let vw = width / viewScale;
    let vh = height / viewScale;


    // // Bounding box
    // rectMode(CORNER);
    // strokeWeight(starBorder);
    // stroke(255, 0, 0);
    // noFill();
    // rect(1, 1, width - 2, height - 2);


    // // Thrust bar
    // noStroke();
    // fill(player.color);
    // rect(0, height - player.thrust * 2, 5, player.thrust * 2);

    stroke(uiColor);
    strokeWeight(1.5 / viewScale)

    // Velocity Display
    push();
    let boxSize = 100 / viewScale;
    translate(25 / viewScale, 25 / viewScale);
    stroke(uiColor);
    // Grid
    let n = 5;
    uiLinesX -= focusStar.thrustX / 10;
    uiLinesY -= focusStar.thrustY / 10;
    uiLinesX = uiLinesX < 0 ? boxSize / n : uiLinesX > boxSize / n ? 0 : uiLinesX;
    uiLinesY = uiLinesY < 0 ? boxSize / n : uiLinesY > boxSize / n ? 0 : uiLinesY;
    for (let i = 0; i < n; i++) {
        line(boxSize / n * i + uiLinesX, 0, boxSize / n * i + uiLinesX, boxSize);
        line(0, boxSize / n * i + uiLinesY, boxSize, boxSize / n * i + uiLinesY);
    }
    // Box
    fill(0, 0, 0, 100);
    stroke(uiColor);
    rect(0, 0, boxSize, boxSize);
    // Circle
    fill(uiColor);
    noStroke()
    circle(boxSize / 2, boxSize / 2, 10 / viewScale);
    pop();

    noStroke();
    fill(uiColor);
    textSize(14 / viewScale);
    text(`Score: ${round(focusStar.radius)}`, 150 / viewScale, 25 / viewScale, 0)
}