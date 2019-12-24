const FPS = 30; 
const FRICTION = 0.7; //friction coefficient of space (0 = no friction, 1 = lots of friction)
const GAME_LIVES = 5; //starting number of lives
const LASER_MAX = 10; //maximum number of lasers on screen at once
const LASER_DIST = 0.6; //maximum distance laser can travel as fraction of screen width
const LASER_EXPLODE_DUR = 0.1; //duration of the lasers explosion in seconds
const LASER_EXPLODE_SIZE = 30; //laser explosion size in radius
const LASER_SPD = 500; //speed of lasers in pixels per second
const ROID_TURN_SPEED = 180; //turn speed in degrees per second
const ROIDS_JAG = 0.4; //jaggedness of the asteroids (0 = none, 1 = lots)
const ROIDS_NUM = 5; //starting number of asteroids
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
const SOUND_ON = true; 
const MUSIC_ON = false; 
const TEXT_FADE_TIME = 2.5; //text fade time in seconds
const TEXT_SIZE = 40; //text font height in pixels
const INSTRUCTIONS = 0; 
const RUNNING = 1;
let state = INSTRUCTIONS;

/** @type {HTMLCanvasElement}*/
var canv = document.getElementById("gameCanvas");   //Canvas is actual DOM node
var ctx = canv.getContext("2d");   //context is an object that can reder graphics inside the canvas

//set up the game parameters
var level, lives, ship, score, highScore, roids, text, textAlpha;

//set up sound effects
var fxLaser = new Sound("sounds/laser.m4a", 5, 0.010);
var fxExplode = new Sound("sounds/explode.m4a", 1, 0.04);
var fxHit = new Sound("sounds/hit.m4a", 5, 0.015);
var fxThrust = new Sound("sounds/thrust.m4a", 1, 0.04);

//set up the music
var music = new Music("sounds/music-low.m4a", "sounds/music-high.m4a");

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

function distBetweenPoints(x1, y1, x2, y2){
    return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
}