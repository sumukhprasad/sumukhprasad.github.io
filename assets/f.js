let sequences = [];
let sequenceProgress = sequences.map(() => 0);
let lastKeyTime = 0;
const TIMEOUT = 1000;

function handleKeyPress(event) {
    const currentTime = Date.now();
    
    if (currentTime - lastKeyTime > TIMEOUT) {
        sequenceProgress.fill(0);
    }

    for (let i = 0; i < sequences.length; i++) {
        const sequence = sequences[i].code;
        const progress = sequenceProgress[i];
	   
        if (event.code === sequence[progress]) {
            sequenceProgress[i]++;
            
            if (sequenceProgress[i] === sequence.length) {
                sequences[i].callback();
                sequenceProgress[i] = 0;
            }
        } else {
            sequenceProgress[i] = 0; 
        }
    }

    lastKeyTime = currentTime;
}

function addSequence(newSequence, callback) {
    sequences.push({ code: newSequence, callback: callback });
    sequenceProgress.push(0);
}

window.addEventListener('keydown', handleKeyPress);
addSequence(['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'KeyB', 'KeyA'], () => {window.location.href = "/banana-slip/index.html";});

let touchStartTime, startX, startY;
let lastTouchTime = 0;
let consecutiveTouches = 0;
const MAX_TOUCH_DURATION = 300;
const MAX_MOVE_THRESHOLD = 100;
const MAX_TIME_BETWEEN_TOUCHES = 500;
const REQUIRED_TOUCHES = 10;

function handleTouchStart(ev) {
	if (ev.touches.length === 1) {
		const touch = ev.touches[0];
		touchStartTime = Date.now();
		startX = touch.clientX;
		startY = touch.clientY;
	}
}

function handleTouchEnd(ev) {
	if (ev.changedTouches.length === 1) {
		const touch = ev.changedTouches[0];
		const touchDuration = Date.now() - touchStartTime;
		const moveX = Math.abs(touch.clientX - startX);
		const moveY = Math.abs(touch.clientY - startY);
		const currentTime = Date.now();
		if (touchDuration < MAX_TOUCH_DURATION && moveX < MAX_MOVE_THRESHOLD && moveY < MAX_MOVE_THRESHOLD) {
			if (currentTime - lastTouchTime <= MAX_TIME_BETWEEN_TOUCHES) {
				consecutiveTouches++;
			} else {
				consecutiveTouches = 1;
			}

			lastTouchTime = currentTime;
			if (consecutiveTouches >= REQUIRED_TOUCHES) {
				xmas();
			}
		}
	}
}


document.addEventListener("touchstart", handleTouchStart);
document.addEventListener("touchend", handleTouchEnd);




function replaceInText(element, pattern, replacement) {
	for (let node of element.childNodes) {
		switch (node.nodeType) {
			case Node.ELEMENT_NODE:
				if (!/SCRIPT|STYLE/.test(node.tagName)) {replaceInText(node, pattern, replacement)}
				break;
			case Node.TEXT_NODE:
				node.textContent = node.textContent.replace(pattern, replacement);
				break;
			case Node.DOCUMENT_NODE:
				replaceInText(node, pattern, replacement);
		}
	}
}

var smenabled = false;
function enableSM() {
	if (smenabled) return;
	smenabled = true;
	const SMEnabledNotice = document.createElement('div');
	SMEnabledNotice.classList.add('hud-notice');
	SMEnabledNotice.innerHTML = '<div><span style="font-size: 100px; font-weight: bold;">P>F</span><br><br>enabled</div>';
	noticeIsShown = true;
	document.body.appendChild(SMEnabledNotice);
	setTimeout(() => {
		SMEnabledNotice.style.opacity = '0';
		setTimeout(() => {
			SMEnabledNotice.remove();
			noticeIsShown = false;
			replaceInText(document.body, /p/g, 'f')
			replaceInText(document.body, /P/g, 'F')
		}, 500);
	}, 2000);
}
addSequence(['KeyS', 'KeyA', 'KeyT', 'KeyY', 'KeyA', 'KeyM', 'KeyO', 'KeyD', 'KeyE'], () => {enableSM()});


function xmas() {
	window.location.href = "/xmas/xmas-web-25/index.html";
}
addSequence(['KeyX', 'KeyM', 'KeyA', 'KeyS'], () => {xmas()});