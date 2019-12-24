import vectorSprite from "./VectorSprite.js";

export default class Laser extends vectorSprite{

    constructor(x, y, a){
        super();
        this.r = 0;
        this.x = x;
        this.y = y;
        this.a = a;
        this.xv = LASER_SPD * Math.cos(a) / FPS;
        this.yv = -LASER_SPD * Math.sin(a) / FPS;
        this.dist = 0;
        this.explodeTime = 0;
    }

    draw(){
        if (this.explodeTime == 0){
            ctx.fillStyle = "salmon";
            ctx.beginPath();
            ctx.arc(this.x, this.y, SHIP_SIZE / 15, 0, Math.PI * 2, false);
            ctx.fill(); 
        }
        else {
            //draw the explosion
            ctx.fillStyle = "orangered";
            ctx.beginPath();
            ctx.arc(this.x, this.y, LASER_EXPLODE_SIZE * 0.75, 0, Math.PI * 2, false);
            ctx.fill(); 
            ctx.fillStyle = "salmon";
            ctx.beginPath();
            ctx.arc(this.x, this.y, LASER_EXPLODE_SIZE * 0.5, 0, Math.PI * 2, false);
            ctx.fill(); 
            ctx.fillStyle = "pink";
            ctx.beginPath();
            ctx.arc(this.x, this.y, LASER_EXPLODE_SIZE * 0.25, 0, Math.PI * 2, false);
            ctx.fill(); 
        }
    }
};