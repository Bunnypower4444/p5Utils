
//#region Imports

import FancyText = p5Utils.Ext.FancyText;

//#endregion

//#region Globals

let animTime = 0;

//#endregion

//#region Canvas

const WindowAspect = 2;
const WindowWidth = 1000;
const MainFont = "Times New Roman";
const BackgroundColor = "white";
const FrameRate = 30;

function setup()
{
    // Setup the canvas
    let canvasSize = p5Utils.CanvasUtils.aspectToSize(WindowAspect, WindowWidth, null);

    createCanvas(canvasSize.x, canvasSize.y);
    frameRate(FrameRate);
}

function draw()
{
    background(BackgroundColor);

    // todo make it so that you can give an absolute time per char bc its just easier
    // then make it so that the animation time can be given in absolute time or 0-1
    
    if (!paused || advanceFrame)
        animTime += deltaTime / 1000;
    advanceFrame = false;
    
    // pausing 
    push();

    noStroke();
    fill("darkblue");
    textFont(MainFont);
    textAlign(CENTER, BOTTOM);
    textSize(24);
    
    text("SHIFT + ENTER = Pause/Play\tSHIFT + SPACE = Frame Advance", width / 2, height);
    if (paused)
    {
        textStyle("bold");
        text("Paused", width / 2, height - 1.5 * textLeading());
    }

    pop();
}

//#endregion

//#region Input

let paused = false;
let advanceFrame = false;
// Pause/Unpause
function keyPressed()
{
    if (!keyIsDown(SHIFT))
        return;

    if (keyCode == ENTER)
        paused = !paused;
    else if (keyCode == 32)
        advanceFrame = true;
}

//#endregion