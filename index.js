import Ship from './Ship.js';
import { createInitialAsteroidBelt, destroyAsteroid } from './AsteroidFunctionality.js';
import { drawSpace, drawGameText, drawScore, drawHighScore, drawLives} from './draw.js';
import { keyDown, keyUp } from './InputHandler.js';

newGame();

//game loop
setInterval(update, 1000 / FPS);  

document.addEventListener("keydown" , keyDown);
document.addEventListener("keyup" , keyUp);

function gameOver() {
    ship.dead = true;
    text = "Game Over";
    textAlpha = 1.0; 
}

function newGame(){
    level = 0;
    lives = GAME_LIVES;
    score = 0;
    ship = new Ship();

    //get the high score from local storage
    var scoreStr = localStorage.getItem(SAVE_KEY_SCORE);
    if (scoreStr == null){
        highScore = 0;
    } else{
        highScore = parseInt(scoreStr); 
    }
    newLevel();
}

export function newLevel(){
    text = "Level " + (level + 1);
    textAlpha = 1.0; 
    createInitialAsteroidBelt();
}

function update(){
    drawSpace();    

    ship.blinkOn = ship.blinkNum % 2 == 0;
    ship.exploding = ship.explodeTime > 0; 

    music.tick()

   
    ship.draw();
    drawLives();
    drawScore();
    drawHighScore();
    for (var i = 0; i < ship.lasers.length; i++){
        ship.lasers[i].draw();
    }
    for (var i = 0; i < roids.length; i++){
        roids[i].draw();
    }

    if(textAlpha >= 0){
        drawGameText();
    } else if (ship.dead){
        newGame();
    }


    ship.thrust();
    for (var i = 0; i < roids.length; i++){
        roids[i].move();
        roids[i].a += roids[i].rot;
    }

    //detect laser hits on asteroids
    var ax, ay, ar, lx, ly;
    for (var i = roids.length - 1; i >= 0; i--){
        ax = roids[i].x;
        ay = roids[i].y;
        ar = roids[i].r;
        for(var j = ship.lasers.length - 1;  j >= 0; j--){
            lx = ship.lasers[j].x;
            ly = ship.lasers[j].y;
            if (ship.lasers[j].explodeTime == 0 && distBetweenPoints(ax, ay, lx, ly) < ar){
                destroyAsteroid(i);
                ship.lasers[j].explodeTime = Math.ceil(LASER_EXPLODE_DUR * FPS);
                break;
            }
        }
    }

    //check for asteroid collisions
    if (!ship.exploding){
        if (ship.blinkNum == 0 && !ship.dead){
            for (var i = 0; i < roids.length; i++){
                if (distBetweenPoints(ship.x, ship.y, roids[i].x, roids[i].y) < ship.r + roids[i].r){
                    ship.explode();
                    destroyAsteroid(i);
                    break;
                }
            }
        }   
        ship.a += ship.rot;
        ship.move();
    } else{
        ship.explodeTime--;
        if(ship.explodeTime == 0){
            lives--;
            if (lives == 0){
                gameOver();
            } else {
                ship = new Ship();
            }
        }
    }

    for (var i = ship.lasers.length - 1; i >= 0; i--){
        if(ship.lasers[i].dist > LASER_DIST * canv.width){
            ship.lasers.splice(i, 1); 
            continue;
        }

        //handle the explosion
        if (ship.lasers[i].explodeTime > 0){
            ship.lasers[i].explodeTime--;

            //destroy the laser after the duration is up
            if (ship.lasers[i].explodeTime == 0){
                ship.lasers.splice(i, 1);
                continue;
            }
        }else {
            ship.lasers[i].move();
            ship.lasers[i].dist += Math.sqrt(Math.pow(ship.lasers[i].xv, 2) + Math.pow(ship.lasers[i].yv, 2));
        }
    }
}
