// enable select animation
let playerState = `idle`;
const dropdown = document.getElementById("animations");
dropdown.addEventListener('change', function(e) {
    playerState = e.target.value;
})


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
// let frameX = 0;
// let frameY = 0;

// enable to set game speed 
let gameFrame = 0; 
const staggerFrames = 3;

// create arrays
// want to get this structure:
/* 
spriteAnimations = [
    "idle": {
        loc: [
            { x:0, y:0 },
            { x:575, y:0 },
            { x:1150, y:0 },
            { x:1725, y:0 },
            { x:2300, y:0 },
            { x:2875, y:0 },
            { x:3450, y:0 },
        ]
    },
    "jump": {
        loc: []
    },
    "run": {
        loc: []
    }
]
*/

const spriteAnimations = [];
const animationStates = [
    { name: `idle`, frames: 7 },
    { name: `jump`, frames: 7 },
    { name: `fall`, frames: 7 },
    { name: `run`, frames: 9 },
    { name: `dizzy`, frames: 11 },
    { name: `sit`, frames: 5 },
    { name: `roll`, frames: 7 },
    { name: `bite`, frames: 7 },
    { name: `ko`, frames: 12 },
    { name: `getHit`, frames: 4 },
];
animationStates.forEach((objState, index) => {
    let thisFrames = {
        loc: [],
    }
    for ( let i=0 ; i < objState.frames ; i++ ) {
        let positionX = i * spriteWidth;
        let positionY = index * spriteHeight;
        thisFrames.loc.push( { x:positionX, y:positionY } ); // create an object of position x and y, which is the value of the `loc` key
    }
    spriteAnimations[objState.name] = thisFrames; // create new key "name", then set value to thisFrames object, in which contains `loc`
});
console.log(spriteAnimations);

// start function 
function animate(){
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT); 
    
    // Explanation: https://youtu.be/GFO_txvwK_c?t=1291

    // let position = Math.floor(gameFrame / staggerFrames) % 6; // cycle between 0 and no. after % ; determining frameX position
    // replace hard-coded #6
    let position = Math.floor(gameFrame / staggerFrames) % spriteAnimations[playerState].loc.length; // cycle between 0 and no. after % ; determining frameX position

    // frameX = spriteWidth * position; // cycle frameX as gameFrame changes
    // update frameX since we now have exact coordinates from spriteAnimations[] array
    let frameX = spriteWidth * position;
    let frameY = spriteAnimations[playerState].loc[position].y;

//   ctx.drawImage(playerImage, frameX * spriteWidth, frameY * spriteHeight, spriteWidth, spriteHeight, 0, 0, spriteWidth, spriteHeight);
    ctx.drawImage(playerImage, frameX, frameY, spriteWidth, spriteHeight, 0, 0, spriteWidth, spriteHeight);
  // remove *spriteWidth from sx because width of sprite is already accounted for in `frameX = spriteWidth * position`
  // same for *spriteHeight from sy
  
//   // ## Add Animation with loop
//   if (gameFrame % staggerFrames == 0 ) { 
//     // ### basic/static loop idea
//     if (frameX<6) frameX++; 
//     else frameX = 0; 
//   }
  
    gameFrame++; // increase gameFrame by 1 for every loop
    requestAnimationFrame(animate); // creates animation loop
};
animate();