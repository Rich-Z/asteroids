import { shootLaser } from './ShipFunctionality.js';

export function keyDown(/** @type {KeyboardEvent */ ev){

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

export function keyUp(/** @type {KeyboardEvent */ ev){
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
