const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');
// console.log(ctx); // Check console to view CanvasRenderingContext2D properties and methods
const CANVAS_WIDTH = canvas.width = 600;
const CANVAS_HEIGHT = canvas.height = 600;

const playerImage = new Image();
playerImage.src = 'https://user-images.githubusercontent.com/8282076/198958521-9a80a832-a236-4ad1-a385-0ec4a80a27e0.png';

// variables for size of 1 sprite on the sheet
const spriteWidth = 575;
const spriteHeight = 523; 

// variables for adding animation with loop
let frameX = 0;
let frameY = 0;

// enable to set game speed 
let gameFrame = 0; 
const staggerFrames = 4;

// start function 
function animate(){
  ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT); 
  
  // ## drawImage();
  // ctx.drawImage(image, sx, sy, sw, wh, dx, dy, dw, dh); // 2-5 arg = source // 6-9 arg = destination
  ctx.drawImage(playerImage, frameX * spriteWidth, frameY * spriteHeight, spriteWidth, spriteHeight, 0, 0, spriteWidth, spriteHeight);
  
  // ## Add Animation with loop
  if (gameFrame % staggerFrames == 0 ) { 
    // ### basic/static loop idea
    if (frameX<6) frameX++; 
    else frameX = 0; 
  }
  
  gameFrame++; // increase gameFrame by 1 for every loop
  requestAnimationFrame(animate); // creates animation loop
};
animate();