gameplayContainer = document.getElementById('gameplay');
var stars = [];
var cwidth = 0;
var cheight = 0;
const pad = 50;

function startGame() {
	gameplayContainer.innerHTML = `
		<div class="slate">
			<div class="slate__inner" id="p_inner">
				<canvas id="touchCanvas" style="position:absolute;z-index:999;"></canvas>
				<canvas id="starCanvas" style="position:absolute;z-index:99;filter: blur(5px);"></canvas>
			</div>
		</div>
	`;

	setTimeout(setUpCanvas, 2000);
}

async function setUpCanvas() {
	canvas = document.getElementById('starCanvas');
	tcanvas = document.getElementById('touchCanvas')
	ctx = canvas.getContext('2d');
	tctx = tcanvas.getContext('2d');

	const container = document.getElementById('p_inner');
	canvas.width = container.clientWidth;
	canvas.height = container.clientHeight;
	tcanvas.width = container.clientWidth;
	tcanvas.height = container.clientHeight;

	const starCount = 6;

	for (let i = 0; i < starCount; i++) {
		const x = pad + Math.random() * (canvas.width - pad * 2);
		const y = pad + Math.random() * (canvas.height - pad * 2);

		stars.push({ x, y });

		await fadeInStar(ctx, x, y);

		await sleep(250);
	}

	await sleep(500);
	
	canvas.classList.add("faded");
	cwidth = canvas.width;
	cheight = canvas.height;
	
	tcanvas.addEventListener('pointerdown', e => {
		const rect = tcanvas.getBoundingClientRect();
		const x = e.clientX - rect.left;
		const y = e.clientY - rect.top;

		const star = fallingStars[0];
		if (!star) return;

		/*const dx = star.x - x;
		const dy = star.y - y;
		const d = Math.sqrt(dx*dx + dy*dy);

		if (d < 25) star.frozen = true;*/
		
		star.frozen = true;
		
		placedStars.push({ x: star.x, y: star.y });
	});
	
	buildFallQueue();
	startFallingLoop(tcanvas, tctx);
	startSequentialFall(tcanvas);
}

function drawStar(ctx, x, y, color) {
	ctx.fillStyle = color;
	ctx.beginPath();
	ctx.arc(x, y, 10, 0, Math.PI * 2);
	ctx.fill();
}

async function fadeInStar(ctx, x, y) {
	return new Promise((resolve) => {
		let opacity = 0;
		const duration = 500;
		const start = performance.now();

		function animate(t) {
			let progress = (t - start) / duration;
			if (progress > 1) progress = 1;

			opacity = progress;

			drawStar(ctx, x, y, `rgba(255,255,255,${opacity})`);

			if (progress < 1) {
				requestAnimationFrame(animate);
			} else {
				resolve();
			}
		}

		requestAnimationFrame(animate);
	});
}

function sleep(ms) {
	return new Promise(r => setTimeout(r, ms));
}



const fallingStarImg = new Image();
fallingStarImg.src = './star.png';

let fallQueue = [];
let fallingStars = [];
let placedStars = [];

function shuffle(array) {
	let currentIndex = array.length;
	while (currentIndex != 0) {
		let randomIndex = Math.floor(Math.random() * currentIndex);
		currentIndex--;
		[array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
	}
}

function buildFallQueue() {
	fallQueue = [];

	stars.forEach(s => {
		fallQueue.push({ x: s.x, y: -20 }); // start above screen
	});

	// add 4 random points
	for (let i = 0; i < 4; i++) {
		fallQueue.push({
			x: pad + Math.random() * (cwidth - pad * 2),
			y: -20
		});
	}

	shuffle(fallQueue);
}


let currentIndex = 0;

async function startSequentialFall(canvas) {
	while (currentIndex < fallQueue.length) {
		spawnSingleStar(canvas, fallQueue[currentIndex].x);
		
		await waitForStarToSettle();

		currentIndex++;
	}

	await sleep(1000);

	
	compileEndScreen();
	changeActiveView("end");
}



function spawnSingleStar(canvas, x) {
	fallingStars = []; // ensure only one active star
	fallingStars.push({
		x,
		y: -30,
		speed: 1.2 + Math.random() * 1.2,
		accelFactor: 1.01,
		frozen: false
	});
}


function waitForStarToSettle() {
	return new Promise(resolve => {
		const check = () => {
			const star = fallingStars[0];
			if (!star) return resolve(); // safety

			// frozen or hit bottom
			if (star.frozen || star.y > cheight + 30) {
				resolve();
			} else {
				requestAnimationFrame(check);
			}
		};
		check();
	});
}


function startFallingLoop(canvas, ctx) {
	function loop() {
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		
		placedStars.forEach(ps => {
			ctx.drawImage(fallingStarImg, ps.x - 12, ps.y - 12, 24, 24);
		});
		fallingStars.forEach(star => {
			if (!star.frozen) {
				star.speed = star.speed*star.accelFactor;
				star.y += star.speed;
			}

			ctx.drawImage(fallingStarImg, star.x - 12, star.y - 12, 24, 24);
		});

		requestAnimationFrame(loop);
	}
	loop();
}


function selectBestPlaced(placed, targets, count = 6) {
	// compute distance from each placed star to nearest target
	const scored = placed.map(p => {
		let best = Infinity;
		targets.forEach(t => {
			const dx = p.x - t.x;
			const dy = p.y - t.y;
			const d = Math.hypot(dx, dy);
			if (d < best) best = d;
		});
		return { p, dist: best };
	});

	scored.sort((a, b) => a.dist - b.dist);

	return scored.slice(0, count).map(s => s.p);
}

function computeAverageDistance(targets, placed) {
	let used = new Set();
	let total = 0;

	placed.forEach(p => {
		let bestDist = Infinity;
		let bestIndex = -1;

		targets.forEach((t, i) => {
			if (used.has(i)) return;

			const dx = p.x - t.x;
			const dy = p.y - t.y;
			const d = Math.hypot(dx, dy);

			if (d < bestDist) {
				bestDist = d;
				bestIndex = i;
			}
		});

		used.add(bestIndex);
		total += bestDist;
	});

	return total / placed.length;
}


function computeScore(avgDist, maxDist) {
	const raw = (maxDist - avgDist) / maxDist;
	const clamped = Math.max(0, Math.min(1, raw));
	return Math.round(clamped * 150);
}

function scoreTitle(score) {
	if (score < 30) return "Apprentice Sky-Gazer";
	if (score < 60) return "Keeper of Fading Embers";
	if (score < 100) return "Celestial Cartographer";
	if (score < 130) return "Archivist of the Firmament";
	return "Astronomer of the Starfall Court";
}



function compileEndScreen() {
	const usedPlaced = selectBestPlaced(placedStars, stars, 6);
	const avg = computeAverageDistance(stars, usedPlaced);
	const maxDist = Math.sqrt(cwidth*cwidth + cheight*cheight) * 0.5;
	const score = computeScore(avg, maxDist);
	const title = scoreTitle(score);

	endScreen = document.getElementById("end");

	endScreen.innerHTML = `
		<h3 style="font-size: 48px;margin-bottom:0;">You finished the game!</h3>

		<h1 style="font-size: 100px;margin:0;">${score}</h1>
		<h1 style="border-top: 1px solid rgba(255, 255, 255, 0.5);
							 color: rgba(255, 255, 255, 0.3);
							 width: fit-content;
							 margin: 0 auto;">
			150
		</h1>

		<h2>${title}</h2>

		<h1 style="text-shadow: 0px 0px 5px #ffb600, 0px -1px 1px white,
													 0px 2px 1px black; 
							 margin-top: 50px;">Starfall</h1>

		<button onclick="share(${score}, '${title}');">share</button>
	`;
}



function createShareableImage(score, title) {
	const canvas = document.createElement('canvas');
	canvas.width = document.getElementById('defaultCanvas0').width;
	canvas.height = document.getElementById('defaultCanvas0').height;
	const ctx = canvas.getContext('2d');
	ctx.drawImage(document.getElementById('defaultCanvas0'), 0, 0);
	
	
	return { canvas, ctx };
}

function drawOverlay(shareCtx, score, title) {
	const w = shareCtx.canvas.width;
	const h = shareCtx.canvas.height;
	const centerX = w / 2;
	const centerY = h / 2;

	shareCtx.fillStyle = '#ffb600';
	shareCtx.font = 'bold 175px "Uncial Antiqua"';
	shareCtx.textAlign = 'center';
	shareCtx.textBaseline = 'middle';
	shareCtx.shadowColor = '#ffb600';
	shareCtx.shadowBlur = 10;

	shareCtx.fillText(score, centerX, centerY - 20);

	shareCtx.shadowBlur = 0;
	shareCtx.strokeStyle = '#ffffff66';
	shareCtx.lineWidth = 2;
	shareCtx.beginPath();
	shareCtx.moveTo(centerX - 120, centerY + 100);
	shareCtx.lineTo(centerX + 120, centerY + 100);
	shareCtx.stroke();
	
	shareCtx.fillStyle = '#ffffff55';
	shareCtx.font = '40px "Uncial Antiqua"';
	shareCtx.fillText("150", centerX, centerY + 120);

	shareCtx.fillStyle = '#ffffffff';
	shareCtx.font = '36px "Uncial Antiqua"';
	shareCtx.fillText(title, centerX, centerY + 200);

	shareCtx.shadowColor = '#ffb600';
	shareCtx.shadowBlur = 10;
	shareCtx.fillStyle = '#ffb600';
	shareCtx.font = '64px "Uncial Antiqua"';
	shareCtx.fillText('Starfall', centerX, h - 70);
}


function exportShareableImage(score, title) {
	const { canvas, ctx } = createShareableImage(score, title);
	drawOverlay(ctx, score, title);

	return canvas.toDataURL('image/png');
}


async function share(score, title) {
	const imgDataUrl = exportShareableImage(score, title);
	

	const blob = await (await fetch(imgDataUrl)).blob();
	
	const file = new File([blob], 'my-constellation.png', { type: 'image/png' });

	if (navigator.canShare && navigator.canShare({ files: [file] })) {
		try {
			await navigator.share({
		 	    files: [file],
		 	    title: "my starfall constellation",
		 	    text: `${title}: ${score} / 150`
			});
		} catch (err) {
			console.error("share canceled or failed:", err);
		}
	} else {
		console.log("web share not supported, downloading instead");
		
		alert("Could not share, downloading instead.")
		const link = document.createElement('a');
		link.download = 'my-constellation.png';
		link.href = imgDataUrl;
		link.click();
	}
}