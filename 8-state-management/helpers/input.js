export default class InputHandler {
    constructor(){
        this.lastKey = '';
        window.addEventListener('keydown', (e) => {
            // console.log(e.key);
            switch(e.key){ // similar to if-else statement
                case "ArrowLeft":
                    this.lastKey = 'PRESS left';
                    break
                case "ArrowRight":
                    this.lastKey = 'PRESS right';
                    break
                case "ArrowDown":
                    this.lastKey = 'PRESS down';
                    break
                case "ArrowUp":
                    this.lastKey = 'PRESS up';
                    break
            }
        });
        window.addEventListener('keyup', (e) => {
            switch(e.key){ // similar to if-else statement
                case "ArrowLeft":
                    this.lastKey = 'RELEASE left';
                    break
                case "ArrowRight":
                    this.lastKey = 'RELEASE right';
                    break
                case "ArrowDown":
                    this.lastKey = 'RELEASE down';
                    break
                case "ArrowUp":
                    this.lastKey = 'RELEASE up';
                    break
            }
        });
    }
}