// Resize the navbar on scroll from the top
window.onscroll = function() {scrollFunction()};
function scrollFunction() {
	if (document.body.scrollTop > 0 || document.documentElement.scrollTop > 0) {
		document.getElementById("topnav").style.fontSize = "max(0.8rem, 1.5vmin)";
		document.getElementById("topnav").style.lineHeight = "max(2.4rem, 4.5vmin)";
	} else {
		document.getElementById("topnav").style.fontSize = "max(0.8rem, 2.2vmin)";
		document.getElementById("topnav").style.lineHeight = "max(2.4rem, 6.6vmin)";
	}
}

// Expand details section when we click on its link in navbar
function openTarget(href) {
	var hash = href.substring(1);
	if(hash) var details = document.getElementById(hash);
	if(details && details.tagName.toLowerCase() === 'details') details.open = true;
}

// ===== Firebase stuff =====
var db = null;

// An inferno, opened to swallow you whole
// Initialize firebase
async function firebaseInit() {
	const firebaseConfig = {
		apiKey: "AIzaSyD-6DKb5XdjbQgAPFTYNqrUUSLCVHUfIrE",
		authDomain: "cucyberclub-webproject.firebaseapp.com",
		projectId: "cucyberclub-webproject",
		storageBucket: "cucyberclub-webproject.appspot.com",
		messagingSenderId: "760426500521",
		appId: "1:760426500521:web:99bffb9cd21009df94f4b8",
		measurementId: "G-Y3DXQEXMYC"
	};
	firebase.initializeApp(firebaseConfig);
	firebase.analytics();

	db = firebase.firestore();

	await initSemSelector();
	await addEvents("all");
	await addMembers();
}

// Initialize the filter by semester selector
async function initSemSelector() {
	const selector = document.getElementById("event-sem-selector");
	const querySnapshot = await db.collection("events").get();
	querySnapshot.forEach((doc) => {
		const option = document.createElement("option");
		option.value = doc.id;
		option.innerText = doc.id;
		selector.appendChild(option);
	});
}

// This is what is first run to populate the events list.
// It queries all events, adds them to an array, and then passes that array to renderEvents
async function addEvents(semester) {
	let events = [];
	if (semester === "all") {
		const querySnapshot = await db.collection("events").get();
		querySnapshot.forEach((doc) => {
			events = events.concat(doc.data().details);
		});
	}
	else {
		const querySnapshot = await db.collection("events").doc(semester).get();
		events = querySnapshot.data().details;
	}
	renderEvents(events);
}

// Adds events to the page
function renderEvents(events) {
	document.getElementById("events").innerHTML = ""

	// Sorted events by time, with most recent first
	events.sort((a, b) => (b.time.seconds - a.time.seconds));

	for (let i = 0; i < events.length; i++) {
		const event = events[i];

		const event_div = document.createElement("div");
		event_div.className = "event";

		const event_title = document.createElement("div");
		event_title.className = "event-title";
		event_title.innerHTML = `${event.name}`;

		const event_details = document.createElement("div");
		event_details.className = "event-details";

		event_details.innerHTML += `<div><img src="./images/clock.svg" alt="time"><span>${getReadableDate(event.time.toDate())} @ ${getReadableTime(event.time.toDate())}</span></div>`;
		event_details.innerHTML += `<span class="separator">/</span>`;
		event_details.innerHTML += `<div><img src="./images/map-marker.svg" alt="location"><span>${event.location}</span></div>`;

		if ("slides" in event) {
			event_details.innerHTML += `<span class="separator">/</span>`;
			event_details.innerHTML += `<div><img src="./images/desktop.svg" alt="slides"><a href="${event.slides}">Slides</a></div>`;
		}
		if("recording" in event) {
			event_details.innerHTML += `<span class="separator">/</span>`;
			event_details.innerHTML += `<div><img src="./images/video-camera.svg" alt="recording"><a href="${event.recording}">Recording</a></div>`;
		}
		if("survey" in event) {
			event_details.innerHTML += `<span class="separator">/</span>`;
			event_details.innerHTML += `<div><img src="./images/list-alt.svg" alt="survey"><a href="${event.survey}">Survey</a></div>`;
		}

		event_div.appendChild(event_title);
		event_div.appendChild(event_details)

		document.getElementById("events").appendChild(event_div);
	}
}

async function addMembers() {
	let querySnapshot = await db.collection("team").doc("members").get();
	const names = querySnapshot.data().names;
	const container = document.getElementById("team-container");
	for (let i = 0; i < names.length; i++) {
		const name = names[i];
		const name_card = document.createElement("div");
		name_card.innerHTML = `${name}`;
		container.appendChild(name_card);
	}
}

function getReadableDate(date) {
	const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
	const day = date.getDate();
	const monthIndex = date.getMonth();
	const year = date.getFullYear();
	return `${day} ${monthNames[monthIndex]} ${year}`;
}

function getReadableTime(date) {
	var hours = date.getHours();
	var minutes = date.getMinutes();
	var ampm = hours >= 12 ? 'PM' : 'AM';
	hours = hours % 12;
	hours = hours ? hours : 12;
	minutes = minutes < 10 ? '0'+minutes : minutes;
	var strTime = hours + ':' + minutes + ' ' + ampm;
	return strTime;
}