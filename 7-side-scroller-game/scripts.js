window.addEventListener('load', function() {
    // game goes here
    const canvas = document.getElementById('canvas1');
    const ctx = canvas.getContext('2d');
    canvas.width = 800;
    canvas.height = 720;

    class InputHandler {
        constructor(){
            this.keys = [];
            window.addEventListener('keydown', (e) => {
                if ((   e.key === 'ArrowDown' || 
                        e.key === 'ArrowUp' || 
                        e.key === 'ArrowLeft' || 
                        e.key === 'ArrowRight' )
                        && this.keys.indexOf(e.key) === -1){
                    this.keys.push(e.key);
                }
                // console.log(e.key, this.keys);
            });
            window.addEventListener('keyup', (e) => {
                if (    e.key === 'ArrowDown' || 
                        e.key === 'ArrowUp' || 
                        e.key === 'ArrowLeft' || 
                        e.key === 'ArrowRight' ){
                    this.keys.splice(this.keys.indexOf(e.key), 1);
                }
                // console.log(e.key, this.keys);
            });
        }
    }

    class Player {
        constructor(gameWidth, gameHeight){
            this.gameWidth = gameWidth;
            this.gameHeight = gameHeight;
            this.width = 200;
            this.height = 200;
            this.x = 0;
            this.y = this.gameHeight - this.height; // bottom
            this.image = document.getElementById('playerImage');
            this.frameX = 0;
            this.frameY = 0;
            this.speed = 0; // if +ve, player moves to right; if -ve, player moves to left
            this.vy = 0;
            this.weight = 1; // gravity
        }
        draw(context){
            context.fillStyle = 'white';
            context.fillRect(this.x, this.y, this.width, this.height);

            // draw Player at bottom left + select (source) frame from spritesheet + stretch image to fill available area
            context.drawImage(this.image, this.frameX*this.width,this.frameY*this.height,this.width,this.height, this.x,this.y,this.width,this.height); 
        }
        update(input){
            if (input.keys.indexOf('ArrowRight') > -1){
                this.speed = 5;
            } else if (input.keys.indexOf('ArrowLeft') > -1) {
                this.speed = -5;
            } else if (input.keys.indexOf('ArrowUp') > -1 && this.onGround()) { // && onGround() to prevent double jump
                this.vy -= 32;
            } else {
                this.speed = 0;
            }
            // horizontal movement
            this.x += this.speed;
            // introduce horizontal boundaries
            if (this.x < 0) this.x = 0; // prevent moving past left edge of game area
            else if (this.x > this.gameWidth - this.width) this.x = this.gameWidth - this.width // player horizontal coordinate > right edge of player rect -> prevent moving past right edge of game area
            // vertical movement
            this.y += this.vy; 
            if (!this.onGround()){ // if player is in the air
                this.vy += this.weight;
                this.frameY = 1; // use different sprite animation row (jumping)
            } else {
                this.vy = 0; // set v back to 0 when jump is complete
                this.frameY = 0; // back on ground -> back to default (onGround) animation
            }
            if (this.y > this.gameHeight - this.height) this.y = this.gameHeight - this.height; // player can never be below bottom of canvas
        }
        onGround(){
            return this.y >= this.gameHeight - this.height; // player is standing on solid ground
        }
    }

    class Background {
        constructor(gameWidth, gameHeight){
            this.gameWidth = gameWidth;
            this.gameHeight = gameHeight;
            this.image = document.getElementById('backgroundImage');
            this.x = 0;
            this.y = 0;
            this.width = 2400;
            this.height = 720;
            this.speed = 7;
        }
        draw(context){
            context.drawImage(this.image, this.x, this.y, this.width, this.height);
            context.drawImage(this.image, this.x+this.width-this.speed, this.y, this.width, this.height); // draw same image twice for illusion of endless scrolling seamless image
        }
        update(){
            this.x -= this.speed; // scroll to the left -20 pixels per frame
            if (this.x < 0 - this.width) this.x = 0; // if bg scroll off-screen, set horizontal x position back to 0
        }
    }

    function handleEnemies(){
        
    }

    function displayStatusText(){

    }

    const input = new InputHandler();
    const player = new Player(canvas.width, canvas.height);
    const background = new Background(canvas.width, canvas.height);
    
    function animate(){
        ctx.clearRect (0,0,canvas.width,canvas.height);
        background.draw(ctx); // draw background first, so player is visible in front
        background.update();
        player.draw(ctx);
        player.update(input);
        requestAnimationFrame(animate); // pass in name of parent function to create endless animation loop
    }
    animate(); 
});