class Star {
	constructor(x, y, r, distance, p) {
		this.x = x;
		this.y = y;
		this.r = r;
		this.startr = r;
		this.fill = 255;
		this.firstX = x;
		this.firstY = y;
		this.distance = distance;
		this.p = p;
	}

	flicker (){
		this.x = this.x + this.p.random(-0.1,0.1);
		this.y = this.y + this.p.random(-0.1,0.1);
		this.r = this.startr + this.p.random(-0.75,0.75);
	}

	parallax (x, y) {
		let
			halfWidth = this.p.width,
			halfHeight = this.p.height,
			isNegative = x - halfWidth > 0 ? -1 : 1,
			isNegativeY = y - halfHeight > 0 ? -1 : 1,

			mapDistance = Math.abs(x - halfWidth) / halfWidth * this.distance,
			mapDistanceY = Math.abs(y - halfHeight) / halfHeight * this.distance;

		this.x = this.firstX + mapDistance * isNegative;
		this.y = this.firstY + mapDistanceY * isNegativeY;
	}

	show (x, y) {
		this.p.noStroke();
		this.p.fill(this.fill);
		this.p.ellipse(this.x, this.y, this.r, this.r);
	}
}


function starryBackground(p) {
	let stars = [];
	let canvas;

	let c1, c2;

	p.windowResized = function () {
		p.resizeCanvas(p.windowWidth, p.windowHeight);
		p.createStars();
	}

	p.createStars = function () {
		for(let i = 0; i < (p.windowWidth*p.windowHeight)/(10**4); i++){
			let x = p.random(p.width)-25;
			let y = p.random(p.height)-25;
			let r = p.random(1,5);
			let distance = p.random(25, 100);
			stars[i] = new Star(x, y, r, distance, p);
		}
	}

	p.setup = function () {
		c1 = p.color("#110033");
		c2 = p.color("#550088");
		canvas = p.createCanvas(p.windowWidth, p.windowHeight);
		canvas.position(0, 0);
		canvas.style('z-index', '1');

		p.frameRate(30);
		p.createStars();
	}


	p.mouseMoved = function () {
		for(let i = 0; i < stars.length; i++) {
			stars[i].parallax(p.mouseX, p.mouseY);
		}
	}

	p.draw = function () {
		for (let i = 0; i < p.height; i++) {
			let inter = p.map(i, 0, p.height, 0, 1); // Interpolation factor
			let c = p.lerpColor(c1, c2, inter);   // Interpolate between c1 and c2
			p.stroke(c);						  // Set the current line color
			p.line(0, i, p.width, i);			   // Draw a horizontal line across the canvas
		}

		for(let i = 0; i < stars.length; i++){
			stars[i].show(p.mouseX, p.mouseY);
			stars[i].flicker();
		}
	}
}



new p5(starryBackground);