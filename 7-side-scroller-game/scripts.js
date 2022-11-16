window.addEventListener('load', function() {
    // game goes here
    const canvas = document.getElementById('canvas1');
    const ctx = canvas.getContext('2d');
    canvas.width = 1400;
    canvas.height = 720;
    let enemies = [];
    let score = 0;
    let gameOver = false;
    const fullScreenButton = document.getElementById('fullScreenButton');

    class InputHandler {
        constructor(){
            this.keys = [];
            this.touchY = '';
            this.touchThreshold = 30; // swipe e.g. must be at least 30 pixels to trigger event
            window.addEventListener('keydown', (e) => {
                if ((   e.key === 'ArrowDown' || 
                        e.key === 'ArrowUp' || 
                        e.key === 'ArrowLeft' || 
                        e.key === 'ArrowRight' )
                        && this.keys.indexOf(e.key) === -1){
                    this.keys.push(e.key);
                } else if (e.key === 'Enter' && gameOver) restartGame();
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
            window.addEventListener('touchstart', e => { // runs once // used to set something up
                this.touchY = e.changedTouches[0].pageY;
                // console.log('start');
                // // explanation of how to use touch events here: https://youtu.be/GFO_txvwK_c?t=20244
                // console.log(e); // check available events/properties/values in browser inspect terminal
            });
            window.addEventListener('touchmove', e => { // runs over and over as long as event is firing // used to make calculation e.g. direction or time of event
                const swipeDistance = e.changedTouches[0].pageY - this.touchY;   
                if (swipeDistance < -this.touchThreshold && this.keys.indexOf('swipe up') === -1) this.keys.push('swipe up'); 
                else if (swipeDistance > this.touchThreshold && this.keys.indexOf('swipe down') === -1) {
                    this.keys.push('swipe down');
                    if (gameOver) restartGame();
                }
                
                // console.log('moving');
            });
            window.addEventListener('touchend', e => { // runs once // used to cleanup, discard recent values not needed anymore
                // console.log(this.keys);
                this.keys.splice(this.keys.indexOf('swipe up'), 1);
                this.keys.splice(this.keys.indexOf('swipe down'), 1);
                // console.log('end');
            });
        }
    }

    class Player {
        constructor(gameWidth, gameHeight){
            this.gameWidth = gameWidth;
            this.gameHeight = gameHeight;
            this.width = 200;
            this.height = 200;
            this.x = 100;
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
        restart(){
            this.x = 100;
            this.y = this.gameHeight - this.height;
            this.maxFrame = 8;
            this.frameY = 0;
        }
        draw(context){
            context.lineWidth = 5;
            context.strokeStyle = 'white';
            // // rect hitbox
            // context.strokeRect(this.x, this.y, this.width, this.height);
            // // circular hitbox
            context.beginPath();
            context.arc(this.x + this.width/2, this.y + this.height/2 + 20, this.width/3, 0, Math.PI * 2);
            context.stroke();

            // draw Player at bottom left + select (source) frame from spritesheet + stretch image to fill available area
            context.drawImage(this.image, this.frameX*this.width,this.frameY*this.height,this.width,this.height, this.x,this.y,this.width,this.height); 
        }
        update(input, deltaTime, enemies){
            // collision detection
            // explanation at 5h 50m 10s: https://youtu.be/GFO_txvwK_c?t=21010
            enemies.forEach(enemy => {
                const dx = (enemy.x + enemy.width/2 - 20) - (this.x + this.width/2);
                const dy = (enemy.y + enemy.height/2) - (this.y + this.height/2 + 20);
                const distance = Math.sqrt(dx*dx+dy*dy);
                if (distance < enemy.width/3 + this.width/3){
                    gameOver = true;
                }
            })
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
            } else if ((input.keys.indexOf('ArrowUp') > -1 || input.keys.indexOf('swipe up') > -1) && this.onGround()) { // && onGround() to prevent double jump
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
        restart(){
            this.x = 0;
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
            context.lineWidth = 5;
            context.strokeStyle = 'white';
            // context.strokeRect(this.x, this.y, this.width, this.height);
            context.beginPath();
            context.arc(this.x + this.width/2 - 20, this.y + this.height/2, this.width/3, 0, Math.PI * 2);
            context.stroke();

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
            if (this.x < 0 - this.width){
                this.markedForDeletion = true; // moved past left edge of canvas
                score++;
            } 
        }
    }

    function handleEnemies(deltaTime){
        if (enemyTimer > enemyInterval + randomEnemyInterval){
            enemies.push(new Enemy(canvas.width, canvas.height));
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

    function displayStatusText(context){
        context.textAlign = 'left';
        context.font = '40px Helvetica';
        context.fillStyle = 'black';
        context.fillText('Score: ' + score, 20, 50);
        context.fillStyle = 'white';
        context.fillText('Score: ' + score, 22, 52); // with offset to create shadow manually
        if (gameOver){
            context.textAlign = 'center';
            context.fillStyle = 'black';
            context.fillText('GAME OVER, press Enter or swipe down to restart!', canvas.width/2, 200);
            context.fillStyle = 'white';
            context.fillText('GAME OVER, press Enter or swipe down to restart!', canvas.width/2+2, 202);
        }
    }

    function restartGame(){
        player.restart();
        background.restart();
        enemies = [];
        score = 0;
        gameOver = false;
        animate(0);
    }

    function toggleFullScreen(){
        console.log(document.fullscreenElement);
        if (!document.fullscreenElement){
            canvas.requestFullscreen().catch(err => {
                alert(`Error, can't enable full-screen mode: ${err.message}`);
            });
        } else {
            document.exitFullscreen();
        }
    }
    fullScreenButton.addEventListener('click', toggleFullScreen);

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
        player.update(input, deltaTime, enemies);
        // enemy1.draw(ctx);
        // enemy1.update();
        handleEnemies(deltaTime); // above 2 lines moved to handleEmenies() function
        displayStatusText(ctx);
        if (!gameOver) requestAnimationFrame(animate); // pass in name of parent function to create endless animation loop
    }
    animate(0); 
});