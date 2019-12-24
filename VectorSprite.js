export default class vectorSprite{
    x;
    y;
    xv;
    yv;
    r;
    a;
    rot;

    move(){
        this.x += this.xv;
        this.y += this.yv;

        if (this.x < 0 - this.r){
            this.x = canv.width + this.r;
        } else if (this.x > canv.width + this.r){
            this.x = 0 - this.r;
        }
        if (this.y < 0 - this.r){
            this.y = canv.height + this.r;
        } else if (this.y > canv.height + this.r){
            this.y = 0 - this.r;
        }
    }
};