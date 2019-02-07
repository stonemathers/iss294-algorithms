//Canvas constants
const BG_COLOR = "#000";

//Fractal vars
let fractals = [];
let fractalColor;
const FRACT_DIV = 3; //Amount to divide by at each fractal step

//Color Pallette
const COLOR_PALLETE = ["#00f", "#0f0", "#f00", "#0ff", "#f0f", "#0ff"];

//Initial state boolean
let drawingStarted;

//Start message vars
const START_MESSAGE_TEXT = "Click to draw...";
//let startMessageFont;

/*
* Run once before site loads
*/
function preload(){
    //startMessageFont = loadFont("fonts/Major_Mono_Display/MajorMonoDisplay-Regular.ttf");
}

/*
* Run at initial load
*/
function setup(){
    createCanvas(windowWidth, windowHeight);
    drawingStarted = false;
    //startMessageFont = font_arr[getRandomInt(0, font_arr.length - 1)];
    background(BG_COLOR);
    displayStartMessage();
}

/*
*   Run every frame
*/
function draw(){
    if(drawingStarted){
        //Draw fractals
        for(i = 0; i < fractals.length; i++){
            let currFrac = fractals[i];
            if(i == fractals.length - 1 && mouseIsPressed){
                currFrac.increaseSize(1);
                currFrac.display();
            }else{
                if(currFrac.stillDisplaying()){
                    currFrac.displatNextStep();
                }else{
                    fractals.splice(i, 1);
                    i--;
                }
            }
        }
    }
}

/*
* Run when window is resized
*/
function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
    if(!drawingStarted){
        displayStartMessage();
    }
  }

/*
* Run when key is pressed
*/
function keyPressed(){
    if(key == 'r' || key == 'R'){
        fractals = [];
        background(BG_COLOR);
    }
}

/*
* Run when mouse is pressed
*/
function mousePressed(){
    drawingStarted = true;
    background(BG_COLOR);
    fractalColor = color(COLOR_PALLETE[Math.floor(random(COLOR_PALLETE.length))]);
    fractals.push(new Fractal(mouseX, mouseY, 3, fractalColor));
}

/*
* Run when mouse is dragged
*/
function mouseDragged(){
    fractals.push(new Fractal(mouseX, mouseY, 3, fractalColor));
}

/*
* Displays start message
*/
function displayStartMessage(){
    let size = Math.min(width, height) / 10;
    let x = width/2;
    let y = height/2;

    fill("white");
    textSize(size);
    textAlign(CENTER, CENTER);
    //textFont(startMessageFont);
    text(START_MESSAGE_TEXT, x, y);
}

/*
* Class for Fractal object
*/
class Fractal{
    constructor(x, y, startSize, color){
        this.x = x;
        this.y = y;
        this.startSize = startSize;
        this.color = color;
        this.stepsToDisplay = 1;

    }
    /*
    * Determine whether fractal has more steps to display
    *
    * Output:
    *   true if fractal has more steps to display, false if not
    */
    stillDisplaying(){
        let denom = Math.pow(FRACT_DIV, this.stepsToDisplay - 1);
        return this.startSize/denom > 2;
    }

    /*
    * Display fractal up to current step
    */
    display(){
        fill(this.color);
        ellipse(this.x, this.y, this.startSize, this.startSize);
    }

    /*
    * Increment current step and then display fractal
    */
    displayNextStep(){
        this.stepsToDisplay++;
        this.display();
    }

    /*
    * Increase fractal starting size
    *
    * Input:
    *   amount - integer amount to increase start size
    */
    increaseSize(amount){
        this.startSize += amount;
    }
}