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
        }
        draw(context){
            context.fillStyle = 'white';
            context.fillRect(this.x, this.y, this.width, this.height);
            // context.drawImage(this.image, 0, 0); // draw Player at top left
            // context.drawImage(this.image, this.x, this.y); // draw Player at bottom left
            // context.drawImage(this.image, this.x, this.y, this.width, this.height); // draw Player at bottom left + stretch image to fill available area
            // context.drawImage(this.image, sx,sy,sw,sh, this.x,this.y,this.width,this.height); // draw Player at bottom left + stretch image to fill available area + select (source) frame from spritesheet
            context.drawImage(this.image, 0,0,this.width,this.height, this.x,this.y,this.width,this.height); // draw Player at bottom left + stretch image to fill available area + select (source) frame from spritesheet
        }
        update(){
            this.x++;
        }
    }

    class Background {

    }

    function handleEnemies(){
        
    }

    function displayStatusText(){

    }

    const input = new InputHandler();
    const player = new Player(canvas.width, canvas.height);
    
    function animate(){
        ctx.clearRect (0,0,canvas.width,canvas.height);
        player.draw(ctx);
        player.update();
        requestAnimationFrame(animate); // pass in name of parent function to create endless animation loop
    }
    animate(); 
});