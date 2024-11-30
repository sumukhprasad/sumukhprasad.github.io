let stars = [];
let canvas;

let c1, c2;  // Ending color (bottom)
    
    
function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
    createStars();
}

function createStars() {
    for(let i = 0; i < (windowWidth*windowHeight)/(10**4); i++){
        let x = random(width)-25;
        let y = random(height)-25;
        let r = random(1,5);
        let distance = random(25, 100);
        stars[i] = new Star(x, y, r, distance, 255);
    }
}

function setup() {
	c1 = color("#110033");
	c2 = color("#550088");
    canvas = createCanvas(windowWidth, windowHeight);
    canvas.position(0, 0);
    canvas.style('z-index', '1');

    frameRate(30);
    createStars();
}


function mouseMoved() {
    for(let i = 0; i < stars.length; i++) {
        stars[i].parallax(mouseX, mouseY);
    }
}

function draw() {
	    for (let i = 0; i < height; i++) {
	        let inter = map(i, 0, height, 0, 1); // Interpolation factor
	        let c = lerpColor(c1, c2, inter);   // Interpolate between c1 and c2
	        stroke(c);                          // Set the current line color
	        line(0, i, width, i);               // Draw a horizontal line across the canvas
	    }

    for(let i = 0; i < stars.length; i++){
        stars[i].show(mouseX, mouseY);
        stars[i].flicker();
    }
}

///

class Star {
    constructor(x, y, r, distance, fill) {
        this.x = x;
        this.y = y;
        this.r = r;
        this.startr = r;
        this.fill = fill;
        this.firstX = x;
        this.firstY = y;
        this.distance = distance;
    }

    flicker (){
        this.x = this.x + random(-0.1,0.1);
        this.y = this.y + random(-0.1,0.1);
        this.r = this.startr + random(-0.75,0.75);
    }

    parallax (x, y) {
        let
            halfWidth = width,
            halfHeight = height,
            isNegative = x - halfWidth > 0 ? -1 : 1,
            isNegativeY = y - halfHeight > 0 ? -1 : 1,

            mapDistance = Math.abs(x - halfWidth) / halfWidth * this.distance,
            mapDistanceY = Math.abs(y - halfHeight) / halfHeight * this.distance;

        this.x = this.firstX + mapDistance * isNegative;
        this.y = this.firstY + mapDistanceY * isNegativeY;
    }

    show (x, y) {
        noStroke();
        fill(this.fill);
        ellipse (this.x, this.y, this.r, this.r);
    }
}
