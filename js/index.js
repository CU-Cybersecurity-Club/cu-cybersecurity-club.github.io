// Firebase stuff
const firebaseConfig = {
	apiKey: "AIzaSyD-6DKb5XdjbQgAPFTYNqrUUSLCVHUfIrE",
	authDomain: "cucyberclub-webproject.firebaseapp.com",
	projectId: "cucyberclub-webproject",
	storageBucket: "cucyberclub-webproject.appspot.com",
	messagingSenderId: "760426500521",
	appId: "1:760426500521:web:99bffb9cd21009df94f4b8",
	measurementId: "G-Y3DXQEXMYC"
};
var db = null;
var allEvents = null;

// Initialize everything
async function init() {
	firebase.initializeApp(firebaseConfig);
	firebase.analytics();

	db = firebase.firestore();
	allEvents = await db.collection("events").orderBy("start", "desc").get();

	addNextEvent();
	addEvents("all");
	initSemSelector();
	await addMembers();
}

// Update the "Next Meeting" text
function addNextEvent() {

	// Grab all events from allEvents
	var events = [];
	allEvents.forEach((doc) => {
		events = events.concat(doc.data().details);
	});

	// Get most recent event
	var event = events.sort((a, b) => (b.time.seconds - a.time.seconds))[0];

	// Display only if event time has not already passed
	if (Math.round(Date.now() / 1000) <= event.time.seconds + 3600) {
		document.getElementById("next-event-container").style.display = "inline";
		document.getElementById("next-event").innerText = event.name;
		document.getElementById("next-event-time").innerText = `${getReadableDate(event.time.toDate())} @ ${getReadableTime(event.time.toDate())}`
	}
}

// Populate the events list
function addEvents(semester) {

	// Grab all events from allEvents matching the semester (all if "all")
	var events = [];
	allEvents.forEach((doc) => {
		if (semester === "all" || doc.id === semester) {
			events = events.concat(doc.data().details);
		}
	});

	// Wipe currently displayed events
	const eventsContainer = document.getElementById("events-container");
	eventsContainer.innerHTML = "";

	// Sort events by time, with most recent first
	events.sort((a, b) => (b.time.seconds - a.time.seconds));

	// Create an HTML element for all events and add it to the #events-container element
	for (let i = 0; i < events.length; i++) {
		const event = events[i];

		const event_title = document.createElement("span");
		event_title.innerHTML = `${event.name}`;

		const event_details = document.createElement("span");

		event_details.innerHTML += `${getReadableDate(event.time.toDate())} @ ${getReadableTime(event.time.toDate())}`;
		event_details.innerHTML += " / ";
		event_details.innerHTML += `${event.location}`;

		if ("slides" in event) {
			event_details.innerHTML += " / ";
			event_details.innerHTML += `<a href="${event.slides}">Slides</a>`;
		}
		if("recording" in event) {
			event_details.innerHTML += " / ";
			event_details.innerHTML += `<a href="${event.recording}">Recording</a>`;
		}

		const divider = document.createElement("hr");

		eventsContainer.appendChild(event_title);
		eventsContainer.appendChild(event_details);
		eventsContainer.appendChild(divider);
	}
}

// Initialize the filter by semester selector
function initSemSelector() {
	allEvents.forEach((doc) => {
		const option = document.createElement("option");
		option.value = doc.id;
		option.innerText = doc.id;
		document.getElementById("events-sem-selector").appendChild(option);
	});
}

// Add members to the members section
async function addMembers() {
	const querySnapshot = await db.collection("team").doc("members").get();
	const names = querySnapshot.data().names;
	for (let i = 0; i < names.length; i++) {
		const name_card = document.createElement("span");
		name_card.innerHTML = `${names[i]}`;
		document.getElementById("team").appendChild(name_card);
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
	var ampm = hours >= 12 ? "PM" : "AM";
	hours = hours % 12;
	hours = hours ? hours : 12;
	minutes = minutes < 10 ? "0"+minutes : minutes;
	var strTime = hours + ":" + minutes + " " + ampm;
	return strTime;
}