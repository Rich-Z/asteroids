export function drawSpace(){
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canv.width, canv.height)
}

export function drawGameText(){
    ctx.textAlign = "center"
    ctx.textBaseline = "middle"
    ctx.fillStyle = "rgba(255, 255, 255, " + textAlpha + ")";
    ctx.font = "small-caps " + TEXT_SIZE + "px dejavu sans mono";
    ctx.fillText(text, canv.width / 2, canv.height * 0.75);
    textAlpha -= (1.0 / TEXT_FADE_TIME / FPS); 
}

export function drawScore(){
    ctx.textAlign = "right"
    ctx.textBaseline = "middle"
    ctx.fillStyle = "white";
    ctx.font = TEXT_SIZE + "px dejavu sans mono";
    ctx.fillText(score, canv.width - SHIP_SIZE/2, SHIP_SIZE);
    textAlpha -= (1.0 / TEXT_FADE_TIME / FPS);
}

export function drawHighScore(){
    ctx.textAlign = "center"
    ctx.textBaseline = "middle"
    ctx.fillStyle = "white";
    ctx.font = TEXT_SIZE * 0.75 + "px dejavu sans mono";
    ctx.fillText("Highscore: " + highScore, canv.width/2, SHIP_SIZE);
    textAlpha -= (1.0 / TEXT_FADE_TIME / FPS);
}

export function drawLives(){
    var lifeColour;
    for (var i = 0; i < lives; i++){
        lifeColour = ship.exploding && i == lives - 1 ? "red" : "white"; 
        ship.drawShip(SHIP_SIZE + i * SHIP_SIZE * 1.2, SHIP_SIZE, 0.5 * Math.PI, lifeColour);
    }
}