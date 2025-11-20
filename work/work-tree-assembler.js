function assemble(entries, id) {
	let treeDiv = document.getElementById(id);
	const cats = retrieveCatList(entries);
	
	var table = document.createElement("table");
	var tbody = document.createElement("tbody");
	
	for (entry of entries) {
		entryRow = document.createElement("tr");
		for (cat of cats) {
			var flag = document.createElement("td");
			
			if (entry.categories.includes(cat)) {
				flag.innerHTML = `<span class="flag">${cat[0]}</span>`;
			}
			
			entryRow.appendChild(flag);
		}
		
		var entryData = document.createElement("td");
		
		entryData.append(assembleDataBox(entry));
		
		entryRow.appendChild(entryData);
		tbody.appendChild(entryRow);
	}
	

	table.appendChild(assembleTableHeader(cats));
	table.appendChild(tbody);
	
	treeDiv.appendChild(table);
}


function assembleDataBox(entry) {
	var d = document.createElement("div");
	d.classList.add("entry");
	
	const yearInfo = entry.startYear == entry.endYear ? `${entry.startYear}` : `${entry.startYear} - ${entry.endYear}`;
	
	var content = `
	<span class="entry-year">${yearInfo}</span> <a href="${entry.link}"><span class="entry-title">${entry.title}</span></a><br><span class="entry-description">${entry.description}</span>
	`;
	
	d.innerHTML = content;
	
	return d;
}


function assembleTableHeader(categories) {
	var th = document.createElement("thead");
	const len = categories.length;
	for (var i = 0; i < len; i++) {
		const cat = categories[i];
		var row = document.createElement("tr");
		var d = document.createElement("td");
		d.setAttribute("colspan", len);
		
		var flag = document.createElement("span");
		flag.classList.add("flag");
		flag.innerText = cat[0];
		d.append(flag, cat.substr(1));
		
		if (i>0) {
			var down = document.createElement("td");
			down.setAttribute("rowspan", len-i);
			row.appendChild(down);
		}
		
		row.appendChild(d);
		th.appendChild(row);
	}
	
	return th;
}


function retrieveCatList(entries) {
	var cats = [];
	
	for (entry of entries) {
		for (category of entry.categories) {
			if (cats.includes(category)) continue;
			
			cats.push(category);
		}
	}
	
	cats.sort();
	return cats;
}


// --------

document.getElementById("work-tree").innerHTML = "";


// TODO move math stuff to second tree
		
const workTreeContent = [
	
	{
		categories: ["experiments", "linguistics"],
		startYear: 2025,
		endYear: 2025,
		title: "Tiny Stack Language",
		description: "turing-complete interpreted esoteric language built in C that provides a basic stack machine to work with",
		link: "../../projects/tsl"
	},
	
	{
		categories: ["experiments", "math"],
		startYear: 2025,
		endYear: 2025,
		title: "Gauss-Elimination Simulator",
		description: "visualise solving a system of equations using Gauss-elimination",
		link: "../../projects/gauss-elimination"
	},
	
	{
		categories: ["automation", "tooling"],
		startYear: 2025,
		endYear: 2025,
		title: "LaTeXMLserv",
		description: "extremely simple PHP file server with LaTeXML integration",
		link: "../../projects/latexmlserv"
	},
	
	{
		categories: ["experiments", "linguistics"],
		startYear: 2025,
		endYear: 2025,
		title: "Markov Chain Predictor",
		description: "text prediction using markov chains",
		link: "../projects/markov-chain-predictor"
	},
	
	{
		categories: ["art", "experiments", "image processing", "graphics", "math"],
		startYear: 2025,
		endYear: 2025,
		title: "Collatz Corals",
		description: "the Collatz (3x+1) conjecture, when plotted as a tree with angular offsets, reveals an interesting pattern",
		link: "../projects/collatz-coral"
	},
	
	{
		categories: ["systems programming", "experiments"],
		startYear: 2025,
		endYear: 2025,
		title: "Boink Kernel Project",
		description: "abstracting every single layer of computer software, from metal to user",
		link: "../projects/boink-kernel-project"
	},
	
	{
		categories: ["experiments"],
		startYear: 2025,
		endYear: 2025,
		title: "Boink Kernel Project -- GLFS",
		description: "a fully custom filesystem implementation for boinkOS",
		link: "../projects/boink-kernel-project#glfs"
	},
	
	{
		categories: ["art", "experiments", "image processing", "graphics"],
		startYear: 2025,
		endYear: 2025,
		title: "Atkinson Dithering Demo",
		description: "",
		link: "../projects/atkinson-dithering"
	},
	
	{
		categories: ["tooling", "automation"],
		startYear: 2025,
		endYear: 2025,
		title: "ISBN Cataloging",
		description: "using python and opencv to catalog my books",
		link: "../blog/2025/04/21/isbn-cataloging.html"
	},
	
	{
		categories: ["competitive programming"],
		startYear: 2022,
		endYear: 2024,
		title: "CodeJam Question Sets",
		description: "",
		link: "../projects/codejam-question-sets"
	},
	
	{
		categories: ["education", "competitive programming"],
		startYear: 2023,
		endYear: 2023,
		title: "BlockJam",
		description: "learn-as-you-go competitive programming for grade 5 at DPS Bangalore South",
		link: "../projects/blockjam"
	},
	
	{
		categories: ["education"],
		startYear: 2023,
		endYear: 2023,
		title: "Create with Computers",
		description: "talk by Mr. Prasanth Nori (www.prasanthnori.com) for grade 4 at DPS Bangalore South",
		link: "../projects/create-with-computers-talk"
	},
	
	{
		categories: ["linguistics", "tooling"],
		startYear: 2023,
		endYear: 2023,
		title: "Indic Language Transliteration",
		description: "transliteration engine for Indian Classical languages",
		link: "../projects/indic-language-transliteration"
	},
	
	{
		categories: ["graphics", "tooling", "math"],
		startYear: 2022,
		endYear: 2022,
		title: "2D Equation Graphing",
		description: "web-based grapher for equations in 2 variables",
		link: "../projects/grapher"
	},
	
]

assemble(workTreeContent, "work-tree");


/*

schema:

[
	{
		categories: ["cat1", "cat2"],
		startYear: 20xx,
		endYear: 20xx, (if both are same, inferred as no range),
		type: 1/2, (1: prominent date/title, 2: only title)
		title: "title",
		description: "",
		link: "xyz"
	},
	...
]



	

*/