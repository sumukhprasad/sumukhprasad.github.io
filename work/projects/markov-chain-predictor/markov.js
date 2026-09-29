let markovModel = {};
let nGramSize = 2;

function tokenize(text) {
	return text.toLowerCase().replace(/[^\w\s]/g, '').split(/\s+/).filter(Boolean);
}

function buildModel(corpusText) {
	document.getElementById("status").innerText = `${new Date().toLocaleTimeString()}: computing...`;
	markovModel = {};
	
	const tokens = tokenize(corpusText);

	for (let i = 0; i < tokens.length - nGramSize; i++) {
		const context = tokens.slice(i, i + nGramSize).join(' ');
		const nextWord = tokens[i + nGramSize];

		if (!markovModel[context]) markovModel[context] = {};
		markovModel[context][nextWord] = (markovModel[context][nextWord] || 0) + 1;
	}
	

	document.getElementById("status").innerText = `${new Date().toLocaleTimeString()}: model computed.`;
}


function recomputeModel() {
	const form = document.querySelector('form');
	nGramSize = parseInt(form['ngram-select'].value);
	let corpus = "";
	
	if (form['corpus-select'].value === 'userinput') {
		corpus = form['corpus-input'].value;
	} else {
		document.getElementById("status").innerText = `${new Date().toLocaleTimeString()}: fetching...`;
		const url = form['corpus-link'].value;
		fetch(url)
			.then(res => res.text())
			.then(text => {
				corpus = text;
				buildModel(corpus);
			})
			.catch((error) => {
 			    document.getElementById("status").innerText = `${new Date().toLocaleTimeString()}: error fetching file, check console`;
			    console.log(error);
			});
		return;
	}
	
	buildModel(corpus);
}

function predictNext(context) {
	let npred = document.forms[0]["npredictions"].value;
	let tokens = tokenize(context);
	let currentContext = tokens.slice(-nGramSize).join(' ');
	var results = [];
	
	for (var i = 0; i < npred; i++) {
		const nextOptions = markovModel[currentContext];
		if (!nextOptions) break;
		
		let nextWord = Object.entries(nextOptions).sort((a, b) => b[1] - a[1])[0][0];
		results.push(nextWord);
		currentContext = tokenize(currentContext + ' ' + nextWord).slice(-nGramSize).join(' ');
	}
	
	return results.join(" ");
}


document.getElementById("markov-input").addEventListener("input", (e) => {
	const form = document.querySelector('form');
	const prediction = predictNext(e.target.value);

	document.getElementById("markov-prediction").innerHTML = `<span style="opacity: 0.4">prediction: </span>${prediction == "" ? "no prediction could be made." : prediction}`;
});