import Asteroid from './Asteroid.js';
import { newLevel } from './index.js';

export function createInitialAsteroidBelt(){
    roids = [];   
    var x, y;
    for (var i = 0; i < ROIDS_NUM + level; i++){
        do { 
            x = Math.floor(Math.random() * canv.width); 
            y = Math.floor(Math.random() * canv.height); 
        } while (distBetweenPoints(ship.x, ship.y, x, y) < ROIDS_SIZE * 2 + ship.r);
        let newAsteroid = new Asteroid(x, y, 3);
        roids.push(newAsteroid);
    }
    let newAsteroid = new Asteroid(x, y, 8);
    roids.push(newAsteroid);
}

export function destroyAsteroid(index){
    var x = roids[index].x;
    var y = roids[index].y;
    var r = roids[index].r;

    if (roids[index].size > 1){
        let newAsteroid = new Asteroid(x, y, roids[index].size - 1);
        roids.push(newAsteroid);
        newAsteroid = new Asteroid(x, y, roids[index].size - 1);
        roids.push(newAsteroid);
    }

    if (roids[index].size > 3){
        score += ROIDS_PTS_LGE;
    } else if (roids[index].size == 2){
        score += ROIDS_PTS_MED;
    } else{
        score += ROIDS_PTS_SML;
    }
    
    //check high score
    if (score > highScore){
        highScore = score;
        localStorage.setItem(SAVE_KEY_SCORE, highScore)
    }
    
    //destroy the asteroid
    roids.splice(index, 1); 
    fxHit.play();

    //new level when no more asteroids
    if (roids.length == 0){
        level++; 
        newLevel(); 
    }
}