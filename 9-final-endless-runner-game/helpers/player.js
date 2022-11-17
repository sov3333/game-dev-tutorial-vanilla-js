import { Sitting, Running, Jumping, Falling } from './playerStates.js'

export class Player {
    constructor(game){
        this.game = game;
        this.width = 100; // single frame width
        this.height = 91.3; // single frame height
        this.x = 50;
        this.y = this.game.height - this.height;
        this.vy = 0;
        this.weight = 1;
        // javascript automatically creates references to all elements with IDs into the global namespace, using it's ID as a variable name:
        this.image = player; // this.image = document.getElementById('player'); 
        this.frameX = 0;
        this.frameY = 0;
        this.speed = 0;
        this.maxSpeed = 10;
        this.states = [new Sitting(this), new Running(this), new Jumping(this), new Falling(this)];
        this.currentState = this.states[0];
        this.currentState.enter();
    }
    update(input){
        this.currentState.handleInput(input);
        // horizontal movement
        this.x += this.speed;
        if (input.includes('ArrowRight')) this.speed = this.maxSpeed;
        else if (input.includes('ArrowLeft')) this.speed = -this.maxSpeed;
        else this.speed = 0;
        if (this.x < 0) this.x = 0;
        if (this.x > this.game.width - this.width) this.x = this.game.width - this.width;
        // vertical movement
        // if (input.includes('ArrowUp') && this.onGround()) this.vy -= 28;
        this.y += this.vy;
        if (!this.onGround()) this.vy += this.weight;
        else this.vy = 0;
    }
    draw(context){
        // visual aid
        context.strokeStyle = 'red';
        context.strokeRect(this.x, this.y, this.width, this.height);
        // draw
        context.drawImage(this.image, this.width*this.frameX,this.height*this.frameY,this.width,this.height, this.x,this.y,this.width,this.height);
    }
    onGround(){
        return this.y >= this.game.height - this.height;
    }
    setState(state){
        this.currentState = this.states[state];
        this.currentState.enter();
    }
}