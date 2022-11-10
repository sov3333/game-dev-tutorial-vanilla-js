const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');
const CANVAS_WIDTH = canvas.width = 800;
const CANVAS_HEIGHT = canvas.height = 700;

let gameSpeed = 10;
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

// Parallax effect is when foreground layer moves faster than the background layer

// Tutorial from: https://youtu.be/GFO_txvwK_c?t=3675

// use JS classes to create blueprint for layer object
// then, create 5 instances of that layer class, 1 for each of the 5 players
// put them in an array, cycle through array to update and draw them

// re-create previous solution but multi-layer enabled
// refactor image layers into javascript class

class Layer {
    constructor(image, speedModifier) {
        this.x = 0;
        this.y = 0;
        this.width = 2400;
        this.height = 700;
        this.x2 = this.width;
        this.image = image;
        this.speedModifier = speedModifier;
        this.speed = gameSpeed * this.speedModifier;
    }
    update(){
        this.speed = gameSpeed * this.speedModifier; // if game has constant never-changing scrolling speed, don't need this line
        if (this.x <= -this.width){
            this.x = this.width + this.x - this.speed;
        }
        if (this.x2 <= -this.width){
            this.x2 = this.width + this.x - this.speed;
        }
        this.x = Math.floor(this.x - this.speed);
        this.x2 = Math.floor(this.x - this.speed);
    }
    draw(){
        ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
        ctx.drawImage(this.image, this.x2, this.y, this.width, this.height);
    }
}

const layer4 = new Layer(backgroundLayer4, 0.5);

function animate() {
    ctx.clearRect(0,0,CANVAS_WIDTH,CANVAS_HEIGHT); 

    layer4.update();
    layer4.draw();

    requestAnimationFrame(animate);
}
animate();