var ActiveView = "start";



function changeActiveView(s) {
	exiting = document.getElementById(ActiveView);
	incoming = document.getElementById(s);
	exiting.style.opacity = "0";
	incoming.style.opacity = "0";
	
	setTimeout(function () {
		exiting.classList.add("hidden");
		incoming.classList.remove("hidden");
		exiting.style.opacity = "0";
		void incoming.offsetWidth; // force browser to acknowledge previous statement.
		incoming.style.opacity = "1";
	}, 1000);
	
	ActiveView = s;
	
	return true;
}