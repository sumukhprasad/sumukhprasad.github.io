let isDragging = false;
let dragStart = { x: 0, y: 0 };
let canvasOffset = { x: 0, y: 0 };
let currentOffset = { x: 0, y: 0 };

const coralCanvas = document.getElementById("canvas");

coralCanvas.addEventListener("mousedown", (e) => {
	isDragging = true;
	dragStart.x = e.offsetX;
	dragStart.y = e.offsetY;
});

coralCanvas.addEventListener("mousemove", (e) => {
	if (isDragging) {
		let dx = e.offsetX - dragStart.x;
		let dy = e.offsetY - dragStart.y;
		currentOffset.x = canvasOffset.x + dx;
		currentOffset.y = canvasOffset.y + dy;
		run();
	}
});

coralCanvas.addEventListener("mouseup", () => {
	isDragging = false;
	canvasOffset.x = currentOffset.x;
	canvasOffset.y = currentOffset.y;
});

coralCanvas.addEventListener("mouseleave", () => {
	isDragging = false;
});

function getCollatzArray(n) {
	var current = n;
	var prevOp = 0;
	var hasReachedOne = false;
	var arr = [[n, 0]];
	while (!hasReachedOne) {
		if (current%2) {
			current = 3*current + 1;
			prevOp = 2;
		} else {
			current = current/2;
			prevOp = 1;
		}
		
		if (current == 1) {
			hasReachedOne = true;
		}
		arr.push([current, prevOp]);
	}
	
	return arr.reverse();
}

function clearCanvas(canvas) {
	const ctx = canvas.getContext("2d");
	ctx.clearRect(0, 0, canvas.width, canvas.height);
}


function getConfig() {
	let form = document.getElementById('config');
	
	return {
		start: form.start.value,
		end: form.end.value,
		branchL: form.length.value,
		strokeWidth: form.stwidth.value,
		turnOp1: form.op1.value,
		turnOp2: form.op2.value,
		hExp: form.hue.value,
		sExp: form.saturation.value,
		vExp: form.value.value
	}
}

function evaluateExp(exp, varsObj) {
	const replacedExp = exp.replace(/%([a-zA-Z_]\w*)/g, (match, varName) => {
		if (varName in varsObj) {
			return varsObj[varName];
		} else {
			throw new Error(`undefined variable: ${varName}`);
		}
	});

	try {
		return eval(replacedExp);
	} catch (e) {
		throw new Error(`invalid expression: ${replacedExp}`);
	}
}

function HSVtoRGB(h, s, v) {
    var r, g, b, i, f, p, q, t;
    if (arguments.length === 1) {
        s = h.s, v = h.v, h = h.h;
    }
    i = Math.floor(h * 6);
    f = h * 6 - i;
    p = v * (1 - s);
    q = v * (1 - f * s);
    t = v * (1 - (1 - f) * s);
    switch (i % 6) {
        case 0: r = v, g = t, b = p; break;
        case 1: r = q, g = v, b = p; break;
        case 2: r = p, g = v, b = t; break;
        case 3: r = p, g = q, b = v; break;
        case 4: r = t, g = p, b = v; break;
        case 5: r = v, g = p, b = q; break;
    }
    return {
        r: Math.round(r * 255),
        g: Math.round(g * 255),
        b: Math.round(b * 255)
    };
}


function drawCollatzTree(canvas, n, branchL, turnOp1, turnOp2, hExp, sExp, vExp, strokeWidth) {
	const ctx = canvas.getContext("2d");
	const degToRad = (deg) => deg * (Math.PI / 180);
	const dpr = window.devicePixelRatio || 1;

	const collatzArr = getCollatzArray(n);

	// setup starting position in center bottom of canvas
	ctx.save();
	ctx.translate((canvas.width/dpr) / 2 + currentOffset.x, (canvas.height/dpr) + currentOffset.y);
	ctx.rotate(degToRad(-90)); // point "up"

	// draw each branch
	let branchLength = branchL;
	for (let i = 0; i < collatzArr.length; i++) {
		let [value, op] = collatzArr[i];
		
		// rotate based on op
		if (op === 1) {
			ctx.rotate(degToRad(turnOp1));
		} else if (op === 2) {
			ctx.rotate(degToRad(turnOp2));
		}

		// draw line
		varObj = {
			step: i+1,
			value: value,
			op: op
		}
		
		color = HSVtoRGB(
			evaluateExp(hExp, varObj)/100,
			evaluateExp(sExp, varObj)/100,
			evaluateExp(vExp, varObj)/100,
		);
		ctx.strokeStyle = `rgb(${color.r}, ${color.g}, ${color.b})`;
		ctx.lineWidth = strokeWidth;
		ctx.beginPath();
		ctx.moveTo(0, 0);
		ctx.lineTo(branchLength, 0);
		ctx.stroke();

		// move to end of line
		ctx.translate(branchLength, 0);
	}

	ctx.restore();
}



function run() {
	setStatus(`working...`);
	conf = getConfig();
	clearCanvas(coralCanvas);
	
	setupCanvasForHiDPI(coralCanvas);
	for (var i = conf.start-1; i < conf.end; i++) {
		drawCollatzTree(coralCanvas, i+1, conf.branchL, conf.turnOp1, conf.turnOp2, conf.hExp, conf.sExp, conf.vExp, conf.strokeWidth);
	}
	

	setStatus(`done`);
	
	return false;
}

function setStatus(s) {
	document.getElementById('status').innerText = s;
}

function setupCanvasForHiDPI(canvas) {
	const dpr = window.devicePixelRatio || 1;
	const rect = canvas.getBoundingClientRect();

	canvas.width = rect.width * dpr;
	canvas.height = rect.height * dpr;

	const ctx = canvas.getContext("2d");
	ctx.setTransform(1, 0, 0, 1, 0, 0); // reset any existing transforms
	ctx.scale(dpr, dpr);
}