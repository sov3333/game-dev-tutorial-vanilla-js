class Enemy {
    constructor(){
        this.frameX = 0;
        this.frameY = 0;
        this.fps = 20;
        this.frameInterval = 1000/this.fps;
        this.frameTimer = 0;
    }
    update(){

    }
    draw(){

    }
}

export class FlyingEnemy extends Enemy {

}

export class GroundEnemy extends Enemy {

}

export class ClimbingEnemy extends Enemy {

}