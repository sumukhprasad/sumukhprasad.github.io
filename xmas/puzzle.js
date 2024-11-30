const content = document.getElementById('content');
const puzzleImages = ['a.jpg', 'b.jpg', 'c.jpg', 'd.jpg', 'e.jpg'];
let puzzleBoard = [];
let emptyTileIndex = 8; // The index of the empty tile (last tile in a 3x3 grid)
let cannotClick = false;
document.getElementById('play').onclick = function() {
    content.classList.add('hidden');
    setTimeout(() => {
        setupPuzzle();
        content.classList.remove('hidden');
    }, 1000);
};

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
    sb = document.createElement('button');
    sb.disabled = true;
    sb.id = 'share';
    sb.innerText = "tap to share";
    content.appendChild(sb);
    puzzle.id = "puzzleboard";
    puzzle.classList.add('puzzleboard');
    content.appendChild(puzzle);
    init();
}

function share() {
	var shareData = {
				text: "Christmas Slide Puzzle",
				url: window.location.href
			}
	if (navigator.share && navigator.canShare(shareData)) {
		navigator.share(shareData);
	} else {
		navigator.clipboard.writeText(window.location.href);
		alert("Copied to clipboard.")
	}
}

function init() {
    // Randomize the image and split it into tiles
    const selectedImage = puzzleImages[Math.floor(Math.random() * puzzleImages.length)];
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
    let shuffleCount = 1; // Number of valid moves to shuffle
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
        [row + 1, col],  // Down
        [row - 1, col],  // Up
        [row, col + 1],  // Right
        [row, col - 1],  // Left
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
            tileElement.style.backgroundImage = `url(${puzzleImages[0]})`;
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
        // Start the swap with animation
        animateTileSwap(clickedTile, clickedTileIndex, emptyTileIndex);
        emptyTileIndex = clickedTileIndex; // Update empty tile position
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
	    		document.getElementById('share').disabled = false;
			document.getElementById('share').onclick = share;
	          document.getElementById('title').classList.remove('hidden');
	    }, 1000);
    }
}