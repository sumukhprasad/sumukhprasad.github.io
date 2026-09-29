function matrixToLatex(matrix, augmentedAt = null) {
	// matrix: 2D array, e.g. [[1,2,3],[4,5,6]]
	// augmentedAt: column index where to put the vertical line (e.g. 2 for after 2nd col)
	const rows = matrix.length;
	const cols = matrix[0].length;

	// build the column spec dynamically
	let colSpec = '';
	for (let i = 0; i < cols; i++) {
		if (augmentedAt !== null && i === augmentedAt) colSpec += '|'; // add vertical line
		colSpec += 'c'; // centered column
	}
	
	return (
		`<br>\\(\\left[\\begin{array}{@{}${colSpec}@{}}\n` +
		matrix.map(row => row.map(x => cascadeDecimal(x)).join(' & ')).join(' \\\\\n') +
		'\n\\end{array}\\right]\\)'
	);
}



function prepareAugmentedMat(A, B) {
	n = A.length;
	for (let i = 0; i < n; i++) {
		A[i] = A[i].concat(B[i]);
	}
}


function forwardEliminateInMat(A) {
	const n = A.length;
	for (let i = 0; i < n; i++) {
		let maxEl = Math.abs(A[i][i]);
		let maxRow = i;
		for (let k = i + 1; k < n; k++) {
			if (Math.abs(A[k][i]) > maxEl) {
				maxEl = Math.abs(A[k][i]);
				maxRow = k;
			}
		}

		if (maxRow !== i) {
			[A[maxRow], A[i]] = [A[i], A[maxRow]];
			document.getElementById("output").innerHTML +=
				`<br><br>\\(\\text{swap } R_{${i+1}} \\leftrightarrow R_{${maxRow+1}}\\)`;
			document.getElementById("output").innerHTML += matrixToLatex(A, A[0].length - 1);
		}

		for (let k = i + 1; k < n; k++) {
			const c = -A[k][i] / A[i][i];
			if (c === 0) continue;
			const sign = c < 0 ? '-' : '+';
			const absC = Math.abs(c.toFixed(3));
			document.getElementById("output").innerHTML +=
				`<br><br>\\(R_{${k+1}} \\to R_{${k+1}} ${sign} ${absC}R_{${i+1}}\\)`;
			for (let j = i; j < n + 1; j++) {
				if (i === j) A[k][j] = 0;
				else A[k][j] += c * A[i][j];
			}
			document.getElementById("output").innerHTML += matrixToLatex(A, A[0].length - 1);
		}
	}
}

function reduceToRREF(A) {
	const rows = A.length;
	const cols = A[0].length;

	for (let i = rows - 1; i >= 0; i--) {
		// find pivot
		let pivotCol = A[i].findIndex(v => Math.abs(v) > 1e-12);
		if (pivotCol === -1) continue;

		// normalize pivot row
		let pivotVal = A[i][pivotCol];
		if (Math.abs(pivotVal - 1) > 1e-12) {
			document.getElementById("output").innerHTML +=
				`<br><br>\\(R_{${i+1}} \\to \\frac{1}{${pivotVal.toFixed(3)}} R_{${i+1}}\\)`;
			for (let j = pivotCol; j < cols; j++) {
				A[i][j] /= pivotVal;
			}
			document.getElementById("output").innerHTML += matrixToLatex(A, cols - 1);
		}

		// clear above pivot
		for (let r = i - 1; r >= 0; r--) {
			let factor = A[r][pivotCol];
			if (Math.abs(factor) < 1e-12) continue;
			const sign = factor < 0 ? '+' : '-';
			const mag = Math.abs(factor).toFixed(3);
			document.getElementById("output").innerHTML +=
				`<br><br>\\(R_{${r+1}} \\to R_{${r+1}} ${sign} ${mag}R_{${i+1}}\\)`;
			for (let c = pivotCol; c < cols; c++) {
				A[r][c] -= factor * A[i][c];
			}
			document.getElementById("output").innerHTML += matrixToLatex(A, cols - 1);
		}
	}
}

function cascadeDecimal(n) {
	if (n%1!=0) {
		return Math.abs(n) < 1e-12 ? '0' : n.toFixed(3);
	} else {return n;}
}

function convert1Dto2D(mat) {
	return (mat
	.map(item => {
		return [item];
	}));
}

function backSubstituteFromMat(A) {
	const x = Array(n).fill(0);
	for (let i = n - 1; i >= 0; i--) {
		x[i] = A[i][n] / A[i][i];
		for (let k = i - 1; k >= 0; k--) {
			A[k][n] -= A[k][i] * x[i];
		}
	}
	
	document.getElementById("output").innerHTML+="<br><br>Solution was found:<br>"
	document.getElementById("output").innerHTML+=matrixToLatex(convert1Dto2D(x))

	return x;
}


function triggerTypeset() {
	var math = document.getElementById("output");
	MathJax.typeset([math]);
}


function solve(A, B) {
	document.getElementById("output").innerHTML="";
	
	document.getElementById("output").innerHTML+="Input matrix:<br>";
	document.getElementById("output").innerHTML+=matrixToLatex(A, A.length);

	aug = prepareAugmentedMat(A, B);
	document.getElementById("output").innerHTML+="<br><br>Augmented matrix:<br>";
	document.getElementById("output").innerHTML+=matrixToLatex(A, A.length);

	document.getElementById("output").innerHTML+="<br><br>Forward-eliminating...<br>";
	forwardEliminateInMat(A);
	
	 if (document.forms[0].mustComputeRREF.checked) {
		 document.getElementById("output").innerHTML += "<br><br>reducing to RREF...<br>";
		 reduceToRREF(A);
	 }
	
	console.log(backSubstituteFromMat(A));
	
	triggerTypeset();
}