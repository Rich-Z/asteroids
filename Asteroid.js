import vectorSprite from "./VectorSprite.js";

export default class Asteroid extends vectorSprite{

    constructor(x, y, size){
        super();
        var lvlMult = 1 + 0.1 * level;
        this.size = size;
        this.x = x;
        this.y = y;
        this.rot = ROID_TURN_SPEED / 180 * Math.random() * Math.PI / FPS * (Math.random() < 0.5 ? 1 : -1);
        this.xv = Math.random() * ROIDS_SPD * lvlMult / FPS * (Math.random() < 0.5 ? 1 : -1);
        this.yv = Math.random() * ROIDS_SPD * lvlMult / FPS * (Math.random() < 0.5 ? 1 : -1);
        this.r = ROIDS_SIZE/8*size;
        this.a = Math.random() * Math.PI * 2; //radians
        this.vert = Math.floor(Math.random() * (ROIDS_VERT + 1) + ROIDS_VERT / 2);  //number of vertices centered around ROIDS_VERT
        this.offs = [];

        for (var i = 0; i < this.vert; i++){
            this.offs.push(Math.random() * ROIDS_JAG * 2 + 1 - ROIDS_JAG); 
        }
    }

    draw(){
        ctx.strokeStyle = "slategrey";
        ctx.lineWidth = SHIP_SIZE / 20; 
        ctx.beginPath();
        ctx.moveTo(
            this.x + this.r * this.offs[0] * Math.cos(this.a),
            this.y + this.r * this.offs[0] * Math.sin(this.a)
        );
        //draw the polygon
        for (var i = 1; i < this.vert; i++){
            ctx.lineTo(
                this.x + this.r * this.offs[i] * Math.cos(this.a + i * Math.PI * 2 / this.vert),   
                this.y + this.r * this.offs[i] * Math.sin(this.a + i * Math.PI * 2 / this.vert)
            );
        }
        ctx.closePath();
        ctx.stroke();
        if (SHOW_BOUNDING){
            ctx.strokeStyle = "lime";
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2, false);
            ctx.stroke();
        }       
    }
}; 

