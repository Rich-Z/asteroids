import vectorSprite from "./VectorSprite.js";

export default class Ship extends vectorSprite{

    constructor(){
        super();
        this.x = canv.width/2;
        this.y = canv.height/2;
        this.xv = 0;
        this.yv = 0;
        this.r = SHIP_SIZE / 2;
        this.a = 90/180 * Math.PI; 
        this.blinkNum = Math.ceil(SHIP_INV_DUR / SHIP_BLINK_DUR);
        this.blinkTime = Math.ceil(SHIP_BLINK_DUR * FPS);
        this.blinkOn = false;
        this.canShoot = true;
        this.dead = false;
        this.explodeTime = 0;
        this.exploding = false; 
        this.lasers = [];
        this.rot = 0;
        this.thrusting = false;
        this.tx = 0; //thrust x
        this.ty = 0; //thrust y
    }

    move(){
        this.xv = this.tx;
        this.yv = this.ty;
        super.move(); 
    }

    thrust(){
        //thrust the ship
        if (this.thrusting && !this.dead){
            this.tx += SHIP_THRUST * Math.cos(this.a) / FPS;
            this.ty -= SHIP_THRUST * Math.sin(this.a) / FPS;
            fxThrust.play();
            if (!this.exploding && this.blinkOn){
                this.drawThruster();
            }
        } else { //apply friction
            this.tx -= FRICTION * this.tx / FPS
            this.ty -= FRICTION * this.ty / FPS
            fxThrust.stop();
        }
    }

    draw(){
        if (!this.exploding){
            if (this.blinkOn && !this.dead){
                this.drawShip(this.x, this.y, this.a);
            }
            if (this.blinkNum > 0) {
                this.blinkTime--;
                if (this.blinkTime == 0){
                    this.blinkTime = Math.ceil(SHIP_BLINK_DUR * FPS);
                    this.blinkNum--; 
                }
            }
        } else{
            this.drawExplosion();
        }
    }

    drawShip(x, y, a, colour = "white"){
        ctx.strokeStyle = colour;
        ctx.lineWidth = SHIP_SIZE / 20;
        ctx.beginPath();
        ctx.moveTo( //nose of ship
            x + 4/3 * this.r * Math.cos(a),
            y - 4/3 * this.r * Math.sin(a)
        );
        ctx.lineTo( //rear left
            x - this.r * (2 / 3 * Math.cos(a) + Math.sin(a)),
            y + this.r * (2 / 3 * Math.sin(a) - Math.cos(a))
        )
        ctx.lineTo( //bottom
            x - this.r * (2 / 3 * Math.cos(a) - Math.sin(a)),
            y + this.r * (2 / 3 * Math.sin(a) + Math.cos(a))
        )
        ctx.closePath();
        ctx.stroke();
    }

    explode(){
        this.explodeTime = Math.ceil(SHIP_EXPLODE_DUR * FPS);
        fxExplode.play();
    }

    drawExplosion() {
        ctx.fillStyle = "darkred";
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.r * 1.7, 0, Math.PI * 2, false);
        ctx.fill();
        ctx.fillStyle = "red";
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.r * 1.4, 0, Math.PI * 2, false);
        ctx.fill();
        ctx.fillStyle = "orange";
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.r * 1.1, 0, Math.PI * 2, false);
        ctx.fill();
        ctx.fillStyle = "yellow";
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.r * 0.8, 0, Math.PI * 2, false);
        ctx.fill();
        ctx.fillStyle = "white";
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.r * 0.5, 0, Math.PI * 2, false);
        ctx.fill();
    }

    drawThruster(){
        ctx.fillStyle = "red";
        ctx.strokeStyle = "yellow";
        ctx.lineWidth = SHIP_SIZE / 10;
        ctx.beginPath();
        ctx.moveTo( //nose of trail
            this.x - 6/3 * this.r * Math.cos(this.a),
            this.y + 6/3 * this.r * Math.sin(this.a)
        );
        ctx.lineTo( //rear left
            this.x - this.r * (2 / 3 * Math.cos(this.a) + 0.5 * Math.sin(this.a)),
            this.y + this.r * (2 / 3 * Math.sin(this.a) - 0.5 * Math.cos(this.a))
        )
        ctx.lineTo( //bottom
            this.x - this.r * (2 / 3 * Math.cos(this.a) - 0.5 * Math.sin(this.a)),
            this.y + this.r * (2 / 3 * Math.sin(this.a) + 0.5 * Math.cos(this.a))
        )
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
    }
}; 
