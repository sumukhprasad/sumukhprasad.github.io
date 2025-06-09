const upload = document.getElementById('upload');
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const grayscaleSelect = document.getElementById('grayscale');
let originalImageData = null;

const thresholdInput = document.getElementById('threshold');
const thresholdVal = document.getElementById('threshold-val');
thresholdInput.addEventListener('input', () => {
	thresholdVal.textContent = thresholdInput.value;
})

const scaleInput = document.getElementById('scale');

upload.addEventListener('change', e => {
	const file = e.target.files[0];
	if (!file) return;

	fileIsAvailable = true;
	const img = new Image();
	img.onload = () => {
		canvas.width = img.width;
		canvas.height = img.height;
		
		canvas.style.width = '100%';
		canvas.style.height = 'auto';
		ctx.drawImage(img, 0, 0);

		const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
		originalImageData = new ImageData(
			new Uint8ClampedArray(imageData.data),
			imageData.width,
			imageData.height
		);
		
		applyDithering();
	};
	img.src = URL.createObjectURL(file);
});

grayscaleSelect.addEventListener('change', applyDithering);
scaleInput.addEventListener('change', applyDithering);
let debounceTimeout;
thresholdInput.addEventListener('input', () => {
	thresholdVal.textContent = thresholdInput.value;
	clearTimeout(debounceTimeout);
	debounceTimeout = setTimeout(() => {
		applyDithering();
	}, 50);
});

function getScaledCanvas(originalImageData, scale) {
	const srcW = originalImageData.width;
	const srcH = originalImageData.height;
	const dstW = Math.floor(srcW / scale);
	const dstH = Math.floor(srcH / scale);

	const tempCanvas = document.createElement('canvas');
	const tempCtx = tempCanvas.getContext('2d');

	tempCanvas.width = srcW;
	tempCanvas.height = srcH;
	tempCtx.putImageData(originalImageData, 0, 0);

	const blockyCanvas = document.createElement('canvas');
	const blockyCtx = blockyCanvas.getContext('2d');

	blockyCanvas.width = dstW;
	blockyCanvas.height = dstH;

	blockyCtx.imageSmoothingEnabled = false;
	blockyCtx.drawImage(tempCanvas, 0, 0, dstW, dstH);
	return blockyCanvas;
}

function applyDithering() {
	if (!originalImageData) return;

	const scale = parseInt(scaleInput.value, 10);
	const threshold = parseInt(thresholdInput.value, 10);
	const grayscale = grayscaleSelect.value;

	const smallCanvas = getScaledCanvas(originalImageData, scale);
	const smallCtx = smallCanvas.getContext('2d');

	const imageData = smallCtx.getImageData(0, 0, smallCanvas.width, smallCanvas.height);

	atkinsonDither(imageData, { grayscale, threshold });

	smallCtx.putImageData(imageData, 0, 0);

	canvas.width = originalImageData.width;
	canvas.height = originalImageData.height;
	ctx.imageSmoothingEnabled = false;
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	ctx.drawImage(
		smallCanvas,
		0, 0, smallCanvas.width, smallCanvas.height,
		0, 0, canvas.width, canvas.height
	);
}



function atkinsonDither(imageData, { grayscale, threshold }) {
	const w = imageData.width;
	const h = imageData.height;
	const data = imageData.data;

	function getIndex(x, y) {
		return (y * w + x) * 4;
	}

	function getGray(r, g, b) {
		switch (grayscale) {
		case 'luminance':
			return 0.2126 * r + 0.7152 * g + 0.0722 * b;

		case 'isor':
			return r;
		case 'isog':
			return g;
		case 'isob':
			return b;

		default:
			return (r + g + b) / 3;
		}
	}

	for (let y = 0; y < h; y++) {
		for (let x = 0; x < w; x++) {
			const idx = getIndex(x, y);
			const r = data[idx];
			const g = data[idx + 1];
			const b = data[idx + 2];

			const oldPixel = getGray(r, g, b);
			const newPixel = oldPixel < threshold ? 0 : 255;
			const quantError = oldPixel - newPixel;

			data[idx] = data[idx + 1] = data[idx + 2] = newPixel;

			const spread = quantError / 8;

			const neighbors = [
				[x + 1, y],
				[x + 2, y],
				[x - 1, y + 1],
				[x, y + 1],
				[x + 1, y + 1],
				[x, y + 2]
			];

			for (const [nx, ny] of neighbors) {
				if (nx >= 0 && nx < w && ny >= 0 && ny < h) {
					const nidx = getIndex(nx, ny);
					for (let i = 0; i < 3; i++) {
						data[nidx + i] = clamp(data[nidx + i] + spread);
					}
				}
			}
		}
	}
}

function clamp(value) {
	return Math.max(0, Math.min(255, value));
}

const downloadBtn = document.getElementById('download');

downloadBtn.addEventListener('click', () => {
	const link = document.createElement('a');
	link.download = 'dithered-image.png';
	link.href = canvas.toDataURL('image/png');
	link.click();
});