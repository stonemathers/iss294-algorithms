# Fractal Drawings: Pseudocode

### Global Constants
- List of color strings
- Fractal color
- List of Fractal objects

### Setup
- Create canvas at window size
- Draw background

### Draw
- For fractal in list of Fractal objects
    - If last fractal in list && mouseIsPressed
        - fractal.increaseSize(1)
        - fractal.display()
    - Else
        - If fractal.stillDisplaying()
            - fractal.drawNextStep()
        - Else
            - Remove fractal from list

### Mouse Pressed
- Create new Fractal object at mouseX, mouseY and add to list

### Mouse Dragged
- Create new Fractal object at mouseX, mouseY and add to list

### Mouse Released
- Change fractal color

### Key Pressed
- If keyPressed is 'r' or 'R'
    - Empty list of Fractals
    - Change fractal color
    - Draw background

### Fractal Object
- Constructor
    - Take in x, y, startSize, and color
- Maintain currStep variable (initialized to 1)
- stillDisplaying()
    - Return (currSize > 2)
- display()
    - draws currStep iterations of circular fractals (using x, y, startSize, and color)
- displayNextStep()
    - Increment currStep
    - this.display()
- increaseSize(amount)
    - Increase startSize by amount
