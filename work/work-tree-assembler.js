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

const workTreeContent = [
		
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