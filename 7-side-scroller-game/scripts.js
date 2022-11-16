window.addEventListener('load', function() {
    // game goes here
    const canvas = document.getElementById('canvas1');
    const ctx = canvas.getContext('2d');
    canvas.width = 800;
    canvas.height = 720;
    let enemies = [];

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
            this.maxFrame = 8;
            this.fps = 20;
            this.frameTimer = 0;
            this.frameInterval = 1000/this.fps; // how many milliseconds each frame lasts
            this.frameY = 0;
            this.speed = 0; // if +ve, player moves to right; if -ve, player moves to left
            this.vy = 0;
            this.weight = 1; // gravity
        }
        draw(context){
            // context.fillStyle = 'white';
            // context.fillRect(this.x, this.y, this.width, this.height);

            // draw Player at bottom left + select (source) frame from spritesheet + stretch image to fill available area
            context.drawImage(this.image, this.frameX*this.width,this.frameY*this.height,this.width,this.height, this.x,this.y,this.width,this.height); 
        }
        update(input, deltaTime){
            // sprite animation
            if (this.frameTimer > this.frameInterval){
                if (this.frameX >= this.maxFrame) this.frameX = 0;
                else this.frameX++;
                this.frameTimer = 0;
            } else {
                this.frameTimer += deltaTime;
            }
            // controls
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
                this.maxFrame = 5;
                this.frameY = 1; // use different sprite animation row (jumping)
            } else {
                this.maxFrame = 8;
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

    class Enemy {
        constructor(gameWidth, gameHeight){
            this.gameWidth = gameWidth;
            this.gameHeight = gameHeight;
            this.width = 160;
            this.height = 119;
            this.image = document.getElementById('enemyImage');
            this.x = this.gameWidth;
            this.y = this.gameHeight - this.height;
            this.frameX = 0;
            this.maxFrame = 5;
            this.fps = 20;
            this.frameTimer = 0;
            this.frameInterval = 1000/this.fps; // how many milliseconds each frame lasts
            this.speed = 8;
            this.markedForDeletion = false;
        }
        draw(context){
            context.drawImage(this.image, this.frameX*this.width,0,this.width,this.height, this.x, this.y, this.width, this.height);
        }
        update(deltaTime){ // keep track how many ms passed bw individual calls, after threshold reached swap frames in spritesheet
            if (this.frameTimer > this.frameInterval){
                if (this.frameX >= this.maxFrame) this.frameX = 0;
                else this.frameX++;
                this.frameTimer = 0;
            } else {
                this.frameTimer += deltaTime;
            }
            this.x -= this.speed;
            if (this.x < 0 - this.width) this.markedForDeletion = true; // moved past left edge of canvas
        }
    }

    function handleEnemies(deltaTime){
        if (enemyTimer > enemyInterval + randomEnemyInterval){
            enemies.push(new Enemy(canvas.width, canvas.height));
            console.log(enemies);
            randomEnemyInterval = Math.random() * 1000 + 500;
            enemyTimer = 0;
        } else {
            enemyTimer += deltaTime;
        }
        enemies.forEach(enemy => {
            enemy.draw(ctx);
            enemy.update(deltaTime);
        });
        enemies = enemies.filter(enemy => !enemy.markedForDeletion);
    }

    function displayStatusText(){

    }

    const input = new InputHandler();
    const player = new Player(canvas.width, canvas.height);
    const background = new Background(canvas.width, canvas.height);
    // const enemy1 = new Enemy(canvas.width, canvas.height);

    let lastTime = 0; // helper var to hold value of timeStamp from previous animation frame
    let enemyTimer = 0;
    let enemyInterval = 1000;
    let randomEnemyInterval = Math.random() * 1000 + 500; // between 500ms and 1500ms
    
    function animate(timeStamp){
        const deltaTime = timeStamp - lastTime; // difference in milliseconds b/w TS from this loop vs previous loop -> ms computer needs to serve 1 animation frame
        lastTime = timeStamp; // so that lastTime can be used in next loop as the timestamp of previous loop
        // console.log(deltaTime); // 1000ms / 60fps ~~ expected result: ~ 16.xxx
        ctx.clearRect (0,0,canvas.width,canvas.height);
        background.draw(ctx); // draw background first, so player is visible in front
        background.update(); // controls scrolling bg
        player.draw(ctx);
        player.update(input, deltaTime);
        // enemy1.draw(ctx);
        // enemy1.update();
        handleEnemies(deltaTime); // above 2 lines moved to handleEmenies() function
        requestAnimationFrame(animate); // pass in name of parent function to create endless animation loop
    }
    animate(0); 
});