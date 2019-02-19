//Canvas constants
const BG_COLOR = "#000";

//Fractal vars
let fractals = [];
let fractalColor;
let clickedFractal;
const FRACT_DIV = 2.5; //Amount to divide by at each fractal step
const INIT_RAD = 10;
const MIN_RAD = 2;
const RAD_INC = 3;
const MAX_SIZE = 240;

//Color Pallette
const COLOR_PALLETE = ["#f66", "#f99", "#fcc", "#ffb266", "#fc9", "#ffe5cc",
                        "#ff6", "#ff9", "#ffc", "#b2ff66", "#cf9", "#e5ffcc",
                        "#6f6", "#9f9", "#cfc", "#66ffb2", "#9fc", "#ccffe5",
                        "#6ff", "#9ff", "#cff", "#66b2ff", "#9cf", "#cce5ff",
                        "#66f", "#99f", "#ccf", "#b266ff", "#c9f", "#e5ccff",
                        "#f6f", "#f9f", "#fcf", "#ff66b2", "#f9c", "#ffcce5"];

//Initial state boolean
let drawingStarted;

//Mode variable (After drawing starts)
const MODE_DRAW = 0;
const MODE_DRAG = 1;
const MODE_ROTATE = 2;
const MODE_ROTATE_AUTO = 3;
const MODE_DISPLAY = 4;
let mode = MODE_DISPLAY;

//Drag vars
const DRAG_SPACING = 5;
let dragCounter = DRAG_SPACING;

//Start message vars
const START_MESSAGE_TEXT = "Click to draw...";
let startMessageFont;

/*
* Run once before site loads
*/
function preload(){
    startMessageFont = loadFont("assets/fonts/Monoton/Monoton-Regular.ttf");
}

/*
* Run at initial load
*/
function setup(){
    createCanvas(windowWidth, windowHeight);
    drawingStarted = false;
    mode = MODE_DRAW;
    angleMode(DEGREES);
    background(BG_COLOR);
    displayStartMessage();
}

/*
*   Run every frame
*/
function draw(){
    if(drawingStarted){
        //Draw fractals
        blendMode(DIFFERENCE);
        for(i = 0; i < fractals.length; i++){
            let currFrac = fractals[i];
            if(i == fractals.length - 1 && mode == MODE_DRAW){
                if(currFrac.getSize() < MAX_SIZE){
                    currFrac.increaseSize(RAD_INC);
                }
                currFrac.display();
            }else{
                if(currFrac.stillDisplaying()){
                    currFrac.displayNextStep();
                }else{
                    //Do nothing
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
        blendMode(BLEND);
        background(BG_COLOR);
    }
}

/*
* Run when mouse is pressed
*/
function mousePressed(){
    if(!drawingStarted){
        drawingStarted = true;
        background(BG_COLOR);
    }

    clickedFractal = getClosestClickedFractal();

    if(clickedFractal !== null){
        /*if(keyIsDown(32)){
            mode = MODE_ROTATE;
        }else if(keyIsDown(65)){
            mode = MODE_ROTATE_AUTO;
        }else{
            mode = MODE_DRAG;
        }*/
        dragCounter = DRAG_SPACING;
        blendMode(BLEND);
        clickedFractal.display();
    }else{
        mode = MODE_DRAW;
        fractalColor = color(COLOR_PALLETE[Math.floor(random(COLOR_PALLETE.length))]);
        fractals.push(new Fractal(mouseX, mouseY, INIT_RAD, fractalColor, 0));
    }
}

/*
* Run when mouse is dragged
*/
function mouseDragged(){
    if(mode != MODE_DRAW){
        if(keyIsDown(32)){
            mode = MODE_ROTATE;
        }else if(keyIsDown(65)){
            mode = MODE_ROTATE_AUTO;
        }else{
            mode = MODE_DRAG;
        }
    }

    if(mode == MODE_DRAG || mode == MODE_DRAW){
        let moveFractal;

        if(mode == MODE_DRAG){
            moveFractal = clickedFractal;
        }else{
            moveFractal = fractals[fractals.length - 1];
        }

        dragCounter--;
        if(dragCounter == 0){
            moveFractal.x = mouseX;
            moveFractal.y = mouseY;
            blendMode(DIFFERENCE);
            moveFractal.display();
            dragCounter = DRAG_SPACING;
        }
    }else if(mode == MODE_ROTATE || mode == MODE_ROTATE_AUTO){
        dragCounter --;
        if(dragCounter == 0){
            if(mode == MODE_ROTATE){
                let newAng = degrees(atan((clickedFractal.y - mouseY)/(clickedFractal.x - mouseX)));
                clickedFractal.angle = newAng;
            }else{
                clickedFractal.angle += 1;
            }
            blendMode(DIFFERENCE);
            clickedFractal.display();
            dragCounter = DRAG_SPACING;
        }
    }
}

/*
* Run when mouse is dragged
*/
function mouseReleased(){
    mode = MODE_DISPLAY;
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
    textFont(startMessageFont);
    text(START_MESSAGE_TEXT, x, y);
}

/*
* Return the Fractal that was clicked. If multiple fractals were clicked,
* return the one whose center is closest to the mouse.
*/
function getClosestClickedFractal(){
    let closest = null;
    let minDist = Number.MAX_VALUE;

    //Iterate from end of array - if there's a tie we want the most recent one
    for(let i = fractals.length - 1; i >= 0; i--){
        let currFrac = fractals[i];
        if(currFrac.mouseIsOver()){
            let dist = currFrac.distFromMouse();
            if(dist < minDist){
                closest = currFrac;
            }
        }
    }

    return closest;
}

/*
* Class for Fractal object
*/
class Fractal{
    constructor(x, y, startSize, color, angle){
        this.x = x;
        this.y = y;
        this.startSize = startSize;
        this.color = color;
        this.angle = angle;
        this.stepsToDisplay = 1;
    }

    /*
    * Determine whether Fractal has more steps to display
    *
    * Output:
    *   true if Fractal has more steps to display, false if not
    */
    stillDisplaying(){
        let denom = Math.pow(FRACT_DIV, this.stepsToDisplay - 1);
        return this.startSize/denom > MIN_RAD;
    }

    /*
    * Display Fractal up to current step
    */
    display(){
        fill(this.color);
        strokeWeight(0);
        this.fractalRecurse(this.x, this.y, this.startSize, this.stepsToDisplay);
    }

    /*
    * Recursive method used by Fractal object to draw fractals
    * 
    * Input:
    *   x - x-coord of current circle
    *   y - y-coord of current circle
    *   size - size of current circle
    *   step - number of recursive steps remaining  
    */
    fractalRecurse(x, y, size, steps){
        if(steps > 0 && size > MIN_RAD){
            ellipse(x, y, size, size);
            let shift = size / 2;
            size = Math.round(size/FRACT_DIV);
            steps--;
            this.fractalRecurse(x - (shift * sin(this.angle)), y - (shift * cos(this.angle)), size, steps); //top
            this.fractalRecurse(x + (shift * cos(this.angle)), y - (shift * sin(this.angle)), size, steps); //right
            this.fractalRecurse(x + (shift * sin(this.angle)), y + (shift * cos(this.angle)), size, steps); //bottom
            this.fractalRecurse(x - (shift * cos(this.angle)), y + (shift * sin(this.angle)), size, steps); //left
        }
    }

    /*
    * Increment current step and then display Fractal
    */
    displayNextStep(){
        this.stepsToDisplay++;
        this.display();
    }

    /*
    * Get the Fractal's starting size (diameter of initial circle)
    */
    getSize(){
        return this.startSize;
    }

    /*
    * Increase Fractal starting size
    *
    * Input:
    *   amount - integer amount to increase start size
    */
    increaseSize(amount){
        this.startSize += amount;
    }

    /*
    * Return true if mouse is over initial Fractal circle, false if not
    */
    mouseIsOver(){
        return this.distFromMouse() < this.startSize/2;
    }

    /*
    * Calculate and return distance between mouse and center of Fractal
    */
    distFromMouse(){
        return dist(mouseX, mouseY, this.x, this.y);
    }

}