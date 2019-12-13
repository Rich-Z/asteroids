
const FPS = 30; 
const FRICTION = 0.7; //friction coefficient of space (0 = no friction, 1 = lots of friction)
const GAME_LIVES = 1; //starting number of lives
const LASER_MAX = 10; //maximum number of lasers on screen at once
const LASER_DIST = 0.6; //maximum distance laser can travel as fraction of screen width
const LASER_EXPLODE_DUR = 0.1; //duration of the lasers explosion in seconds
const LASER_EXPLODE_SIZE = 30; //laser explosion size in radius
const LASER_SPD = 500; //speed of lasers in pixels per second
const ROIDS_JAG = 0.4; //jaggedness of the asteroids (0 = none, 1 = lots)
const ROIDS_NUM = 1; //starting number of asteroids
const ROIDS_PTS_LGE = 20; //points scored for a large asteroid
const ROIDS_PTS_MED = 50; //points scored for a large asteroid
const ROIDS_PTS_SML = 100; //points scored for a large asteroid
const ROIDS_SIZE = 100; //starting size of asteroids in pixels
const ROIDS_SPD = 50; //max starting speed of asteroids in pixels per second
const ROIDS_VERT = 10; //average number of vertices on each asteroid
const SHIP_SIZE = 30; //ship height in pixels
const SHIP_EXPLODE_DUR = 0.3; //duration of the ship's explosion in seconds
const SHIP_BLINK_DUR = 0.1; //duration of the ship's blink during invulnerability in seconds
const SAVE_KEY_SCORE = "highscore"; //save key for local storage of score
const SHIP_INV_DUR = 3; //duration of the ship's invulnerability in seconds
const SHIP_TURN_SPEED = 360; //turn speed in degrees per second
const SHIP_THRUST = 5; //acceleration of the ship
const SHOW_BOUNDING = false; //show or hide collision bounding - used for testing
const SOUND_ON = false; 
const MUSIC_ON = false; 
const TEXT_FADE_TIME = 2.5; //text fade time in seconds
const TEXT_SIZE = 40; //text font height in pixels


/** @type {HTMLCanvasElement}*/
var canv = document.getElementById("gameCanvas");   //Canvas is actual DOM node
var ctx = canv.getContext("2d");   //context is an object that can reder graphics inside the canvas

//set up sound effects
var fxLaser = new Sound("sounds/laser.m4a", 5, 0.02);
var fxExplode = new Sound("sounds/explode.m4a", 1, 0.05);
var fxHit = new Sound("sounds/hit.m4a", 5, 0.02);
var fxThrust = new Sound("sounds/thrust.m4a", 1, 0.05);

//set up the music
var music = new Music("sounds/music-low.m4a", "sounds/music-high.m4a");

//set up the game parameters
var level, lives, ship, score, highScore, roids, text, textAlpha;

newGame();

//game loop
setInterval(update, 1000 / FPS);  //call update function every 2nd parameter seconds - 1second divided by FPS

//event handlers
document.addEventListener("keydown" , keyDown);
document.addEventListener("keyup" , keyUp);

function createInitialAsteroidBelt(){
    roids = [];   //clear roids array
    var x, y;
    for (var i = 0; i < ROIDS_NUM + level; i++){
        do { 
        x = Math.floor(Math.random() * canv.width); 
        y = Math.floor(Math.random() * canv.height); 
        } while (distBetweenPoints(ship.x, ship.y, x, y) < ROIDS_SIZE * 2 + ship.r);
        newAsteroid = new Asteroid(x, y, Math.ceil(3));
        roids.push(newAsteroid);
    }
    console.log(roids.length)
    console.log(roids[0])
}

function destroyAsteroid(index){
    var x = roids[index].x;
    var y = roids[index].y;
    var r = roids[index].r;

    //split the asteroid in two if necessary
    if (roids[index].size == 3){
        newAsteroid = new Asteroid(x, y, 2);
        roids.push(newAsteroid);
        newAsteroid = new Asteroid(x, y, 2);
        roids.push(newAsteroid);
        score += ROIDS_PTS_LGE;
    } else if (roids[index].size == 2){
        newAsteroid = new Asteroid(x, y, 1);
        roids.push(newAsteroid);
        newAsteroid = new Asteroid(x, y, 1);
        roids.push(newAsteroid);
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

function distBetweenPoints(x1, y1, x2, y2){
    return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
}

function gameOver() {
    ship.dead = true;
    text = "Game Over";
    textAlpha = 1.0; 
}

function keyDown(/** @type {KeyboardEvent */ ev){

    if (ship.dead){
        return;
    }
    
    switch(ev.keyCode){
        case 32:         //space bar (shoot laser)
            shootLaser();
            break;
        case 37:         //key code for left keyboard button
            ship.rot = SHIP_TURN_SPEED / 180 * Math.PI / FPS; 
            break;
        case 38:         //up
            ship.thrusting = true;
            break;
        case 39:         //right
            ship.rot = -SHIP_TURN_SPEED / 180 * Math.PI / FPS;
            break;
    }
}

function keyUp(/** @type {KeyboardEvent */ ev){
    if (ship.dead){
        return;
    }

    switch(ev.keyCode){
        case 32:         //space bar (allow shooting again)
            ship.canShoot = true;
            break;
        case 37:         //stop rotating left
            ship.rot = 0
            break;
        case 38:         //stop thrusting
            ship.thrusting = false;
            break;
        case 39:         //stop rotating right
            ship.rot = 0
            break;
    }
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

function newLevel(){
    text = "Level " + (level + 1);
    textAlpha = 1.0; 
    createInitialAsteroidBelt();
}


function shootLaser(){
    //create the laser object
    if (ship.canShoot && ship.lasers.length < LASER_MAX){
        x = ship.x + 4/3 * ship.r * Math.cos(ship.a);
        y = ship.y - 4/3 * ship.r * Math.sin(ship.a); 
        laser = new Laser(x, y, ship.a); 
        ship.lasers.push(laser);
        fxLaser.play();
    }
    //prevent further shooting
    ship.canShoot = false; 
}


function Sound(src, maxStreams = 1, vol = 1.0){
    this.streamNum = 0;
    this.streams = [];
    for(var i = 0 ; i < maxStreams; i++){
        this.streams.push(new Audio(src));
        this.streams[i].volume = vol;
    }

    this.play = function(){ //cycles through each of audios
        if (SOUND_ON){
            this.streamNum = (this.streamNum + 1) % maxStreams
            this.streams[this.streamNum].play();
        } 
    }

    this.stop = function(){ //cycles through each of audios
        this.streams[this.streamNum].pause();
        this.streams[this.streamNum].currentTime = 0;
    }
}

function Music(srcLow, srcHigh){
    this.soundLow = new Audio(srcLow);
    this.soundHigh = new Audio(srcHigh);
    this.low = true;
    this.tempo = 1.0;  //seconds per beat
    this.beatTime = 0; // frames left until next beat

    this.play = function(){
        if (MUSIC_ON){
            if(this.low){
                this.soundLow.play();
            } else {
                this.soundHigh.play(); 
            }
            this.low = !this.low; 
        }
    }

    this.tick = function(){
        if (this.beatTime == 0){
            this.play();
            this.beatTime = Math.ceil(this.tempo * FPS);
        } else {
            this.beatTime--; 
        }
    }
}

function update(){
    var blinkOn = ship.blinkNum % 2 == 0;
    var exploding = ship.explodeTime > 0; 

    //tick the music
    music.tick()

    //draw space
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canv.width, canv.height)
    
    //thrust the ship
    if (ship.thrusting && !ship.dead){
        ship.thrust.x += SHIP_THRUST * Math.cos(ship.a) / FPS;
        ship.thrust.y -= SHIP_THRUST * Math.sin(ship.a) / FPS;
        fxThrust.play();

        //draw thruster
        if (!exploding && blinkOn){
            ctx.fillStyle = "red";
            ctx.strokeStyle = "yellow";
            ctx.lineWidth = SHIP_SIZE / 10;
            ctx.beginPath();
            ctx.moveTo( //nose of trail
                ship.x - 6/3 * ship.r * Math.cos(ship.a),
                ship.y + 6/3 * ship.r * Math.sin(ship.a)
            );
            ctx.lineTo( //rear left
                ship.x - ship.r * (2 / 3 * Math.cos(ship.a) + 0.5 * Math.sin(ship.a)),
                ship.y + ship.r * (2 / 3 * Math.sin(ship.a) - 0.5 * Math.cos(ship.a))
            )
            ctx.lineTo( //bottom
                ship.x - ship.r * (2 / 3 * Math.cos(ship.a) - 0.5 * Math.sin(ship.a)),
                ship.y + ship.r * (2 / 3 * Math.sin(ship.a) + 0.5 * Math.cos(ship.a))
            )
            ctx.closePath();
            ctx.fill();
            ctx.stroke();
        }

    } else { //apply friction
        ship.thrust.x -= FRICTION * ship.thrust.x / FPS
        ship.thrust.y -= FRICTION * ship.thrust.y / FPS
        fxThrust.stop();
    }

    //draw ship
    if (!exploding){
        if (blinkOn && !ship.dead){
            ship.draw(ship.x, ship.y, ship.a);
        }

        //handle blinking
        if (ship.blinkNum > 0) {
            //reduce the blink time
            ship.blinkTime--;

            //reduce the blink num
            if (ship.blinkTime == 0){
                ship.blinkTime = Math.ceil(SHIP_BLINK_DUR * FPS);
                ship.blinkNum--; 
            }
        }
    } else{
        //draw the explosion
        ctx.fillStyle = "darkred";
        ctx.beginPath();
        ctx.arc(ship.x, ship.y, ship.r * 1.7, 0, Math.PI * 2, false);
        ctx.fill();
        ctx.fillStyle = "red";
        ctx.beginPath();
        ctx.arc(ship.x, ship.y, ship.r * 1.4, 0, Math.PI * 2, false);
        ctx.fill();
        ctx.fillStyle = "orange";
        ctx.beginPath();
        ctx.arc(ship.x, ship.y, ship.r * 1.1, 0, Math.PI * 2, false);
        ctx.fill();
        ctx.fillStyle = "yellow";
        ctx.beginPath();
        ctx.arc(ship.x, ship.y, ship.r * 0.8, 0, Math.PI * 2, false);
        ctx.fill();
        ctx.fillStyle = "white";
        ctx.beginPath();
        ctx.arc(ship.x, ship.y, ship.r * 0.5, 0, Math.PI * 2, false);
        ctx.fill();
    }

    if (SHOW_BOUNDING){
        ctx.strokeStyle = "lime";
        ctx.beginPath();
        ctx.arc(ship.x, ship.y, ship.r, 0, Math.PI * 2, false);
        ctx.stroke();
    }

    //draw the lasers
    for (var i = 0; i < ship.lasers.length; i++){
        ship.lasers[i].draw();
    }

    //draw the game text
    if(textAlpha >= 0){
        ctx.textAlign = "center"
        ctx.textBaseline = "middle"
        ctx.fillStyle = "rgba(255, 255, 255, " + textAlpha + ")";
        ctx.font = "small-caps " + TEXT_SIZE + "px dejavu sans mono";
        ctx.fillText(text, canv.width / 2, canv.height * 0.75);
        textAlpha -= (1.0 / TEXT_FADE_TIME / FPS); 
    } else if (ship.dead){
        newGame();
    }

    //draw the lives
    var lifeColour;
    for (var i = 0; i < lives; i++){
        lifeColour = exploding && i == lives - 1 ? "red" : "white"; 
        ship.draw(SHIP_SIZE + i * SHIP_SIZE * 1.2, SHIP_SIZE, 0.5 * Math.PI, lifeColour);
    }

    //draw the score
    ctx.textAlign = "right"
    ctx.textBaseline = "middle"
    ctx.fillStyle = "white";
    ctx.font = TEXT_SIZE + "px dejavu sans mono";
    ctx.fillText(score, canv.width - SHIP_SIZE/2, SHIP_SIZE);
    textAlpha -= (1.0 / TEXT_FADE_TIME / FPS);

    //draw the highscore
    ctx.textAlign = "center"
    ctx.textBaseline = "middle"
    ctx.fillStyle = "white";
    ctx.font = TEXT_SIZE * 0.75 + "px dejavu sans mono";
    ctx.fillText("Highscore: " + highScore, canv.width/2, SHIP_SIZE);
    textAlpha -= (1.0 / TEXT_FADE_TIME / FPS);

    //detect laser hits on asteroids
    var ax, ay, ar, lx, ly;
    for (var i = roids.length - 1; i >= 0; i--){

        //grab the asteroid properties
        ax = roids[i].x;
        ay = roids[i].y;
        ar = roids[i].r;

        //loop over the lasers
        for(var j = ship.lasers.length - 1;  j >= 0; j--){
            
            //grab the laser properties
            lx = ship.lasers[j].x;
            ly = ship.lasers[j].y;

            //detect hits
            if (ship.lasers[j].explodeTime == 0 && distBetweenPoints(ax, ay, lx, ly) < ar){
                //remove the asteroid
                destroyAsteroid(i);
                ship.lasers[j].explodeTime = Math.ceil(LASER_EXPLODE_DUR * FPS);
                break;
            }
        }
    }

    for (var i = 0; i < roids.length; i++){
        roids[i].draw();
    }

    //check for asteroid collisions
    if (!exploding){
        if (ship.blinkNum == 0 && !ship.dead){
            for (var i = 0; i < roids.length; i++){
                if (distBetweenPoints(ship.x, ship.y, roids[i].x, roids[i].y) < ship.r + roids[i].r){
                    ship.explode();
                    destroyAsteroid(i);
                    break;
                }
            }
        }   

        //rotate ship
        ship.a += ship.rot

        //move the ship
        ship.x += ship.thrust.x;
        ship.y += ship.thrust.y;
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
    
    //handle edge of screen
    if (ship.x < 0 - ship.r){
        ship.x = canv.width + ship.r;
    } else if (ship.x > canv.width + ship.r){
        ship.x = 0 - ship.r;
    }
    if (ship.y < 0 - ship.r){
        ship.y = canv.height + ship.r;
    } else if (ship.y > canv.height + ship.r){
        ship.y = 0 - ship.r;
    }

    //move the lasers
    for (var i = ship.lasers.length - 1; i >= 0; i--){
        //check distance travelled
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
            //move the laser
            ship.lasers[i].x += ship.lasers[i].xv
            ship.lasers[i].y += ship.lasers[i].yv
            
            //calculate the distance travelled
            ship.lasers[i].dist += Math.sqrt(Math.pow(ship.lasers[i].xv, 2) + Math.pow(ship.lasers[i].yv, 2));
        }

        // handle edge of screen for lasers
        if (ship.lasers[i].x < 0) {
            ship.lasers[i].x = canv.width;
        } else if (ship.lasers[i].x > canv.width){
            ship.lasers[i].x = 0;
        }
        if (ship.lasers[i].y < 0) {
            ship.lasers[i].y = canv.height;
        } else if (ship.lasers[i].y > canv.height){
            ship.lasers[i].y = 0;
        }
    }
    


    //move the asteroids
    for (var i = 0; i < roids.length; i++){
        //movement
        roids[i].x += roids[i].xv;
        roids[i].y += roids[i].yv;

        // handle edge of screen
        if (roids[i].x < 0 - roids[i].r){
            roids[i].x = canv.width + roids[i].r;
        } else if (roids[i].x > canv.width + roids[i].r){
            roids[i].x = 0 - roids[i].r;
        }
        if (roids[i].y < 0 - roids[i].r){
            roids[i].y = canv.height + roids[i].r;
        } else if (roids[i].y > canv.height + roids[i].r){
            roids[i].y = 0 - roids[i].r;
        }  
    }
}
