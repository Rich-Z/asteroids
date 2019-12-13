function Laser(x, y, a){
    this.x = x;
    this.y = y;
    this.a = a;
    this.xv = LASER_SPD * Math.cos(a) / FPS;
    this.yv = -LASER_SPD * Math.sin(a) / FPS;
    this.dist = 0;
    this.explodeTime = 0;

    this.draw = function(){
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


// function shootLaser(){
//     //create the laser object
//     if (ship.canShoot && ship.lasers.length < LASER_MAX){
//         ship.lasers.push({
//             x: ship.x + 4/3 * ship.r * Math.cos(ship.a),
//             y: ship.y - 4/3 * ship.r * Math.sin(ship.a),
//             xv: LASER_SPD * Math.cos(ship.a) / FPS,
//             yv: -LASER_SPD * Math.sin(ship.a) / FPS,
//             dist: 0,
//             explodeTime: 0
//         });
//         fxLaser.play();
//     }
//     //prevent further shooting
//     ship.canShoot = false; 
// }

// if (ship.lasers[i].explodeTime == 0){
//     ctx.fillStyle = "salmon";
//     ctx.beginPath();
//     ctx.arc(ship.lasers[i].x, ship.lasers[i].y, SHIP_SIZE / 15, 0, Math.PI * 2, false);
//     ctx.fill(); 
// }
// else {
//     //draw the explosion
//     ctx.fillStyle = "orangered";
//     ctx.beginPath();
//     ctx.arc(ship.lasers[i].x, ship.lasers[i].y, ship.r * 0.75, 0, Math.PI * 2, false);
//     ctx.fill(); 
//     ctx.fillStyle = "salmon";
//     ctx.beginPath();
//     ctx.arc(ship.lasers[i].x, ship.lasers[i].y, ship.r * 0.5, 0, Math.PI * 2, false);
//     ctx.fill(); 
//     ctx.fillStyle = "pink";
//     ctx.beginPath();
//     ctx.arc(ship.lasers[i].x, ship.lasers[i].y, ship.r * 0.25, 0, Math.PI * 2, false);
//     ctx.fill(); 
// }