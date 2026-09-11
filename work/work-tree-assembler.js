function assemble(entries, id) {
	let treeDiv = document.getElementById(id);
	const cats = retrieveCatList(entries);
	
	var table = document.createElement("table");
	var tbody = document.createElement("tbody");
	
	for (entry of entries) {
		entryRow = document.createElement("tr");
		
		for (cat of cats) {
			var flag = document.createElement("td");
			flag.dataset.category = cat;
			if (entry.categories.includes(cat)) {
				flag.innerHTML = `<span class="flag" title="${cat}">${cat[0]}</span>`;
			}
			
			entryRow.appendChild(flag);
		}
		
		var entryData = document.createElement("td");
		
		entryData.append(assembleDataBox(entry));
		
		entryRow.appendChild(entryData);
		entryRow.classList.add("entry-row");
		entryRow.dataset.categories = JSON.stringify(entry.categories);
		
		tbody.appendChild(entryRow);
	}
	

	table.appendChild(assembleTableHeader(cats));
	table.appendChild(tbody);
	
	var optionsDiv = document.createElement("div");
	optionsDiv.classList.add("options");
	var hasBorders = document.createElement("input");
	hasBorders.setAttribute('type', 'checkbox');
	hasBorders.setAttribute('name', 'hasBorders');
	var hasBordersLabel = document.createElement("label");
	hasBordersLabel.setAttribute('name', 'hasBorders');
	hasBordersLabel.innerText = "Show borders";
	
	hasBorders.onchange = (function () {
		if (hasBorders.checked) {
			table.style.borderCollapse = "separate";
			table.setAttribute('border', '1');
		} else {
			table.style.borderCollapse = "collapse";
			table.setAttribute('border', '0');
		}
	});
	
	optionsDiv.appendChild(hasBordersLabel);
	optionsDiv.appendChild(hasBorders);
	treeDiv.appendChild(optionsDiv);
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
		d.setAttribute("colspan", len-i+1);
		
		var flag = document.createElement("span");
		flag.classList.add("flag");
		flag.innerText = cat[0];
		d.append(flag, cat.substr(1));
		d.dataset.category = cat;
		
		if (i>0) {
			var down = document.createElement("td");
			down.setAttribute("rowspan", len-i);
			down.dataset.category = categories[i-1];
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

function setHoverCharacteristics() {
	document.querySelectorAll("#work-tree .entry-row").forEach(entry => {
	    entry.addEventListener("mouseenter", () => {
	        const categories = JSON.parse(entry.dataset.categories);

	        categories.forEach(category => {
	            document
	                .querySelectorAll(
	                    `#work-tree [data-category="${CSS.escape(category)}"]`
	                )
	                .forEach(el => el.classList.add("highlight"));
	        });
	    });

	    entry.addEventListener("mouseleave", () => {
	        document
	            .querySelectorAll("#work-tree .highlight")
	            .forEach(el => el.classList.remove("highlight"));
	    });
	});
}


// --------

document.getElementById("work-tree").innerHTML = "";
assemble(workTreeContent, "work-tree");
setHoverCharacteristics();

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

Now provided through work_tree.yml!

*/