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
        this.speed = 0;
        this.maxSpeed = 10;
    }
    update(input){
        // horizontal movement
        this.x += this.speed;
        if (input.includes('ArrowRight')) this.speed = this.maxSpeed;
        else if (input.includes('ArrowLeft')) this.speed = -this.maxSpeed;
        else this.speed = 0;
        if (this.x < 0) this.x = 0;
        if (this.x > this.game.width - this.width) this.x = this.game.width - this.width;
        // vertical movement
        if (input.includes('ArrowUp') && this.onGround()) this.vy -= 28;
        this.y += this.vy;
        if (!this.onGround()) this.vy += this.weight;
        else this.vy = 0;
    }
    draw(context){
        // visual aid
        context.strokeStyle = 'red';
        context.strokeRect(this.x, this.y, this.width, this.height);
        // draw
        context.drawImage(this.image, this.width*0,this.height*0,this.width,this.height, this.x,this.y,this.width,this.height);
    }
    onGround(){
        return this.y >= this.game.height - this.height;
    }
}