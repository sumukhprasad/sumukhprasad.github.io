const content = document.getElementById('content');
const puzzleImages = ['a.jpg', 'b.jpg', 'c.jpg', 'd.jpg', 'e.jpg'];
const selectedImage = puzzleImages[Math.floor(Math.random() * puzzleImages.length)];
let puzzleBoard = [];
let emptyTileIndex = 8;
let cannotClick = false;
let moves = 0;
document.getElementById('play').onclick = function() {
	content.classList.add('hidden');
	setTimeout(() => {
		setupPuzzle();
		content.classList.remove('hidden');
	}, 1000);
};

// Because on mobile, when shares are cancelled from outside the browser, e.g., "Discard" clicked on Instagram, the promise never resolves, and the only way to get it to work is using an iframe.
var sharingIframe     = document.createElement("iframe");
var sharingIframeBlob = new Blob([`<!DOCTYPE html><html>`],{type:"text/html"});
sharingIframe.src     = URL.createObjectURL(sharingIframeBlob);
sharingIframe.setAttribute("allow", "web-share")

sharingIframe.style.display = "none"; // make it so that it is hidden

document.documentElement.appendChild(sharingIframe); // add it to the DOM

function setupPuzzle() {
	while (content.firstChild) {
		content.removeChild(content.lastChild);
	}

	const puzzle = document.createElement('div');
	h = document.createElement('h1');
	h.id = "title";
	h.classList.add("title");
	h.innerText = "Finish the slide puzzle!"
	content.appendChild(h)
	puzzle.id = "puzzleboard";
	puzzle.classList.add('puzzleboard');
	content.appendChild(puzzle);
	

	nextbutton = document.createElement('button');
	nextbutton.disabled = true;
	nextbutton.id = 'next';
	nextbutton.innerText = "you got a badge!";
	nextbutton.classList.add('hidden');
	nextbutton.style = "margin-top: 25px;"
	content.appendChild(nextbutton);
	
	init();
}

function showSharePage() {
	content.classList.add('hidden');

	setTimeout(() => {
		while (content.firstChild) {
			content.removeChild(content.lastChild);
		}
		

		h = document.createElement('h1');
		h.id = "title";
		h.classList.add("title");
		h.innerText = "You got a badge!";
		content.appendChild(h);
		
		img = document.createElement('img');
		img.src = "./award.png";
		img.style = "width: 256px; height: 256px;"
		content.appendChild(img);
		
		badgeElement = document.createElement('h2');
		badgeElement.innerText = "Christmas Puzzle Wizard"
		content.appendChild(badgeElement);
		
		movesElement = document.createElement('h3');
		movesElement.innerText = `solved in ${moves} move${moves>1 ? "s" : ""}`
		content.appendChild(movesElement);
		
		shareDiv = document.createElement("div");
		shareDiv.style = "margin-top: 25px;"
		
		shareButton = document.createElement('button');
		shareButton.innerText = "share the puzzle!";
		shareButton.onclick = share;
		
		shareDiv.appendChild(shareButton)
		
		content.appendChild(shareDiv);
	
		content.classList.remove('hidden');
	}, 1000);
}

function share() {
	var shareData = {
		text: generateRandomSharePhrase(),
		url: window.location.href
	};

	fetch("./share.png")
		.then(response => response.blob())
		.then(imageBlob => {
			// Add the image Blob to the shareData
			shareData.files = [
				new File([imageBlob], "share.png", { type: imageBlob.type })
			];

			// Attempt to share with the image
			if (sharingIframe.contentWindow.navigator.share && sharingIframe.contentWindow.navigator.canShare(shareData)) {
				sharingIframe.contentWindow.navigator.share(shareData);
				sharingIframe.contentWindow.location.reload();
			} else {
				navigator.clipboard.writeText(window.location.href);
				alert("Copied to clipboard.");
			}
		})
		.catch(error => {
			console.error("Error fetching image:", error);
			// Fallback to sharing without the image if fetching fails
			if (sharingIframe.contentWindow.navigator.share && sharingIframe.contentWindow.navigator.canShare(shareData)) {
				sharingIframe.contentWindow.navigator.share(shareData);
				sharingIframe.contentWindow.location.reload();
			} else {
				navigator.clipboard.writeText(window.location.href);
				alert("Copied to clipboard.");
			}
		});
}

function generateRandomSharePhrase() {
	let phrases = [
		`feeling festive af... solved this in ${moves} move${moves>1 ? "s" : ""} ⛄🎄`, 
		`sleighed this in ${moves} 🎄`, 
		`slid into christmas like a pro... ${moves} move${moves>1 ? "s" : ""}!!! 💪🎄`, 
		`merry slidemas to me 😌🎄 ${moves} move${moves>1 ? "s" : ""}, u in? 👀`, 
		`elves could never... solved this in ${moves} ✨🎅`, 
		`main character energy solving this 🎄 in ${moves}, no big deal ✨`, 
		`speed-running christmas, 1 puzzle at a time 🎄`, 
		`i'snow big deal, just crushed this in ${moves} move${moves>1 ? "s" : ""} ❄️💪`, 
		`santa's not the only one working magic this season 🎅 ${moves} move${moves>1 ? "s" : ""} ✨`, 
		`puzzle didn’t stand a chance 🎄 ${moves} move${moves>1 ? "s" : ""}, who's next? 👀`,
		`call me santa bc I just delivered in ${moves} move${moves>1 ? "s" : ""} 🎅💨`,
		`unwrapping W’s this holiday season 🎁 ${moves} move${moves>1 ? "s" : ""} 🔥`,
		`certified festive genius 🎄 ${moves} move${moves>1 ? "s" : ""}, try me 😏`
	]
	
	return phrases[Math.floor(Math.random() * phrases.length)]
}

function init() {
	// Randomize the image and split it into tiles
	const puzzleData = createPuzzleGrid(selectedImage);

	// Generate puzzle tiles
	puzzleBoard = puzzleData;

	shufflePuzzle();
	emptyTileIndex = puzzleBoard.indexOf(null); // Set the initial empty tile index
	renderPuzzle();
}

function createPuzzleGrid(image) {
	const gridSize = 3;
	const grid = [];
	let index = 0;

	// Create the initial grid
	for (let y = 0; y < gridSize; y++) {
		for (let x = 0; x < gridSize; x++) {
			if (index === gridSize * gridSize - 1) {
				grid.push(null); // Empty space for the sliding puzzle
			} else {
				grid.push({ x, y });
			}
			index++;
		}
	}

	return grid;
}

function shufflePuzzle() {
	let shuffleCount = 36; // Number of valid moves to shuffle
	while (shuffleCount--) {
		const validMoves = getValidMoves(emptyTileIndex);
		const randomMove = validMoves[Math.floor(Math.random() * validMoves.length)];

		// Swap the empty tile with the selected valid move
		swapTiles(emptyTileIndex, randomMove);
		emptyTileIndex = randomMove;
	}
}

function getValidMoves(emptyIndex) {
	const [row, col] = getTilePosition(emptyIndex);
	const moves = [];

	const directions = [
		[row + 1, col],	// Down
		[row - 1, col],	// Up
		[row, col + 1],	// Right
		[row, col - 1],	// Left
	];

	directions.forEach(([r, c]) => {
		if (r >= 0 && r < 3 && c >= 0 && c < 3) {
			moves.push(r * 3 + c); // Convert 2D position back to 1D index
		}
	});

	return moves;
}

function getTilePosition(index) {
	return [Math.floor(index / 3), index % 3];
}

function swapTiles(index1, index2) {
	const temp = puzzleBoard[index1];
	puzzleBoard[index1] = puzzleBoard[index2];
	puzzleBoard[index2] = temp;
}

function renderPuzzle() {
	const puzzleBoardElement = document.getElementById('puzzleboard');
	puzzleBoardElement.innerHTML = ''; // Clear the board

	puzzleBoard.forEach((tile, index) => {
		const tileElement = document.createElement('div');
		tileElement.classList.add('tile');
		if (tile === null) {
			tileElement.classList.add('empty');
		} else {
			tileElement.style.backgroundImage = `url(${selectedImage})`;
			tileElement.style.backgroundPosition = `${-tile.x * 100}px ${-tile.y * 100}px`;
		}
		tileElement.dataset.index = index;
		tileElement.addEventListener('click', handleTileClick);
		puzzleBoardElement.appendChild(tileElement);
	});
}

function handleTileClick(e) {
	if (cannotClick) return;
	const clickedTile = e.target;
	const clickedTileIndex = parseInt(clickedTile.dataset.index);

	const validMoves = getValidMoves(emptyTileIndex);
	if (validMoves.includes(clickedTileIndex)) {
		animateTileSwap(clickedTile, clickedTileIndex, emptyTileIndex);
		emptyTileIndex = clickedTileIndex;
		moves++;
	}
}

function animateTileSwap(clickedTile, clickedTileIndex, emptyTileIndex) {
	const clickedTilePosition = getTilePosition(clickedTileIndex);
	const emptyTilePosition = getTilePosition(emptyTileIndex);

	clickedTile.classList.add('tile-swap');
	clickedTile.style.transform = `translate(${(emptyTilePosition[1] - clickedTilePosition[1]) * 100}px, ${(emptyTilePosition[0] - clickedTilePosition[0]) * 100}px)`;

	const emptyTile = document.querySelector(`.tile[data-index="${emptyTileIndex}"]`);
	emptyTile.classList.add('tile-swap');
	emptyTile.style.transform = `translate(${(clickedTilePosition[1] - emptyTilePosition[1]) * 100}px, ${(clickedTilePosition[0] - emptyTilePosition[0]) * 100}px)`;

	// After animation, swap tiles in puzzle board
	setTimeout(() => {
		clickedTile.classList.remove('tile-swap');
		emptyTile.classList.remove('tile-swap');
		clickedTile.style.transform = '';
		emptyTile.style.transform = '';

		swapTiles(emptyTileIndex, clickedTileIndex); // Swap tiles in the array

		checkIfSolved();
		renderPuzzle();
	}, 200); // Match the animation duration
}

function checkIfSolved() {
	const solvedPuzzle = [
		{ x: 0, y: 0 }, { x: 1, y: 0 }, { x: 2, y: 0 },
		{ x: 0, y: 1 }, { x: 1, y: 1 }, { x: 2, y: 1 },
		{ x: 0, y: 2 }, { x: 1, y: 2 }, null
	];

	const isSolved = puzzleBoard.every((tile, index) => {
		return tile === null || (
			tile.x === solvedPuzzle[index]?.x && tile.y === solvedPuzzle[index]?.y
		);
	});

	if (isSolved) {
		cannotClick = true;
		document.getElementById('title').classList.add("hidden");
		setTimeout(() => {
			document.getElementById('title').innerText = "You solved the puzzle!";
			document.getElementById('title').classList.remove('hidden');
			document.getElementById('next').onclick = showSharePage;
			document.getElementById('next').disabled = false;
			document.getElementById('next').classList.remove('hidden');
		}, 1000);
	}
}