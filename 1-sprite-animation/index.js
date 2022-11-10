const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');
// console.log(ctx); // Check console to view CanvasRenderingContext2D properties and methods
const CANVAS_WIDTH = canvas.width = 600;
const CANVAS_HEIGHT = canvas.height = 600;

const playerImage = new Image();
playerImage.src = 'https://user-images.githubusercontent.com/8282076/198958521-9a80a832-a236-4ad1-a385-0ec4a80a27e0.png';
// let x = 0;

// variables for size of 1 sprite on the sheet
const spriteWidth = 575;
const spriteHeight = 523; // total 5230px height of canvas with 10 rows

// variables for adding animation with loop
let frameX = 0;
let frameY = 0;

// enable to set game speed 
let gameFrame = 0; // initialize the gameFrame to use for a loop later
const staggerFrames = 4; // this sets the "speed" of the game, by checking (gameFrame % staggerFrames == 0) before incrementing frameX value (i.e. moving to the next frame);


function animate(){
  ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT); // clear all paint from canvas, specify area, in this case whole canvas.
  
  // ctx.fillRect(50,50,100,100); // draw rectangle; (startX,startY,endX,endY); default color is black if fillStyle is not specified.
  // x++; // if let x=0; then in function replace fillRect(x,50,100,100), to test animation of the Rect.
  
  // ## drawImage();
  // ctx.drawImage(playerImage, 0, 0); // built in drawImage method, takes 3 or 5 or 9 arguments. first is always image want to draw; then x,y coordinates where you want it to be drawn
  
  // ctx.drawImage(image, sx, sy, sw, wh, dx, dy, dw, dh);
  // 1st argument: specify image want to draw
  // 2nd - 5th argument: source: specify rectangle area to crop out from original large spritesheet
  // 6th - 9th argument: destination: where i want the cropped out part to display on canvas
  
  // ctx.drawImage(playerImage, 0, 0, spriteWidth, spriteHeight, 0, 0, spriteWidth, spriteHeight); // displays first frame
  // edit sx and sy to : (..., 0 * spriteWidth, 0 * spriteHeight, ...) ==> enable choose frame by editing 0.
  // in sx/sy, instead of using `0*`, assign frameX = 0; frameY = 0; outside and replace 0* with frameX/Y*.
  ctx.drawImage(playerImage, frameX * spriteWidth, frameY * spriteHeight, spriteWidth, spriteHeight, 0, 0, spriteWidth, spriteHeight);
  
  // ## Add Animation with loop
  
  if (gameFrame % staggerFrames == 0 ) { // place loop into this if statement to control speed
    
    // ### basic loop idea
    if (frameX<6) frameX++; // however different rows may have different no. of frameX
    else frameX = 0; // hence we need to a) when we change frameY value, also need to b) change hard coded #6 on above line to reflect correct no. of frames for each animation row e.g. w a maxFrame variable
    
  }
  
  
  // loop with 
  
  
  // ### Increase gameFrame by 1 for every loop
  gameFrame++; 
  
  // ## Start Animate
  requestAnimationFrame(animate); // runs function passed to the method i.e. calls parent function animate and runs over and over, creating animation loop
};
animate();