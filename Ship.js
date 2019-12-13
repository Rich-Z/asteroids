function Ship(){
    this.x = canv.width/2;
    this.y = canv.height/2;
    this.r = SHIP_SIZE / 2;
    this.a = 90/180 * Math.PI; 
    this.blinkNum = Math.ceil(SHIP_INV_DUR / SHIP_BLINK_DUR);
    this.blinkTime = Math.ceil(SHIP_BLINK_DUR * FPS);
    this.canShoot = true;
    this.dead = false;
    this.explodeTime = 0;
    this.lasers = [];
    this.rot = 0;
    this.thrusting = false;
    this.thrust = 
        {
            x: 0,
            y: 0
        };
    //drawShip
    this.draw = function(x, y, a, colour = "white"){  //white is default colour if none provided
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
    };
    this.explode = function(){
        this.explodeTime = Math.ceil(SHIP_EXPLODE_DUR * FPS);
        fxExplode.play();
    };
}

