import Laser from './Laser.js';

export function shootLaser(){
    //create the laser object
    if (ship.canShoot && ship.lasers.length < LASER_MAX){
        let x = ship.x + 4/3 * ship.r * Math.cos(ship.a);
        let y = ship.y - 4/3 * ship.r * Math.sin(ship.a); 
        let laser = new Laser(x, y, ship.a); 
        ship.lasers.push(laser);
        fxLaser.play();
    }
    //prevent further shooting
    ship.canShoot = false; 
}