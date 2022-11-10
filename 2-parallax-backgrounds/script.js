const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');
const CANVAS_WIDTH = canvas.width = 800;
const CANVAS_HEIGHT = canvas.height = 700;

let gameSpeed = 25;
// there is a gap b/w the 2 images now because x-=gameSpeed has a remainder / doesn't go to 0 exactly
// doesn't reset at same time because x and x2 are separate

const backgroundLayer1 = new Image(); // same as `document.createElement("img");`
backgroundLayer1.src = '/2-parallax-backgrounds/images/layer-1.png';
const backgroundLayer2 = new Image();
backgroundLayer2.src = '/2-parallax-backgrounds/images/layer-2.png';
const backgroundLayer3 = new Image();
backgroundLayer3.src = '/2-parallax-backgrounds/images/layer-3.png';
const backgroundLayer4 = new Image();
backgroundLayer4.src = '/2-parallax-backgrounds/images/layer-4.png';
const backgroundLayer5 = new Image();
backgroundLayer5.src = '/2-parallax-backgrounds/images/layer-5.png';

let x = 0; // starting point of image
let x2 = 2400; // create 2 backgrounds to cycle behind one another

function animate() {
    ctx.clearRect(0,0,CANVAS_WIDTH,CANVAS_HEIGHT); 
    ctx.drawImage(backgroundLayer4, x, 0); 
    ctx.drawImage(backgroundLayer4, x2, 0); 
    // detect if image has moved off screen, then start it one cycle behind
    if (x < -2400) x = 2400 + x2 - gameSpeed; // img width in this example is 2400px
    else x -= gameSpeed; // scrolling of game attached to gameSpeed variable
    if (x2 < -2400) x2 = 2400 + x - gameSpeed; // `+x-gameSpeed` to offset gap
    else x2 -= gameSpeed;

    requestAnimationFrame(animate);
}
animate();