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

		if (document.forms[0].canSwap.checked && maxRow !== i) {
			[A[maxRow], A[i]] = [A[i], A[maxRow]];
			document.getElementById("output").innerHTML +=
				`<br><br>\\(\\text{swap } R_{${i+1}} \\leftrightarrow R_{${maxRow+1}}\\)`;
			document.getElementById("output").innerHTML += matrixToLatex(A, A[0].length - 1);
		}

		for (let k = i + 1; k < n; k++) {
			const c = -A[k][i] / A[i][i];
			if (c === 0) continue;
			const sign = c < 0 ? '+' : '-';
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
	console.log(backSubstituteFromMat(A));
	triggerTypeset();
}