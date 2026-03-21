// Firebase stuff
const firebaseConfig = {
  apiKey: "AIzaSyD-6DKb5XdjbQgAPFTYNqrUUSLCVHUfIrE",
  authDomain: "cucyberclub-webproject.firebaseapp.com",
  projectId: "cucyberclub-webproject",
  storageBucket: "cucyberclub-webproject.appspot.com",
  messagingSenderId: "760426500521",
  appId: "1:760426500521:web:99bffb9cd21009df94f4b8",
  measurementId: "G-Y3DXQEXMYC",
};

var db = null;
var allEvents = null;

// Initialize everything
async function init() {
  firebase.initializeApp(firebaseConfig);
  firebase.analytics();

  db = firebase.firestore();

  // Fetch events and members in parallel :)
  const [eventsSnap] = await Promise.all([
    db.collection("events").orderBy("start", "desc").get(),
    addMembers(),
  ]);

  allEvents = eventsSnap;

  addEvents();
}

// Populate recent sessions with the 6 most recent past events
function addEvents() {
  const now = Math.round(Date.now() / 1000);
  const events = [];
  allEvents.forEach((doc) => events.push(...doc.data().details));

  const container = document.getElementById("past-sessions-container");
  const fragment = document.createDocumentFragment();

  events
    .filter((e) => e.time.seconds < now)
    .sort((a, b) => b.time.seconds - a.time.seconds)
    .slice(0, 6)
    .forEach((event) => {
      const date = event.time.toDate();
      const card = document.createElement("div");
      card.className = "recap-card";
      card.innerHTML = `
        <div class="recap-title">${event.name}</div>
        <div class="recap-meta">${getReadableDate(date)} · ${event.location || ""}</div>
      `;
      fragment.appendChild(card);
    });

  container.innerHTML = "";
  // one dom write :)
  container.appendChild(fragment);
}

// Add members to the members section
async function addMembers() {
  const snap = await db.collection("team").doc("members").get();
  const names = snap.data().names;

  const teamContainer = document.getElementById("team");
  const facesContainer = document.getElementById("member-faces");

  const teamFrag = document.createDocumentFragment();
  const facesFrag = document.createDocumentFragment();

  names.forEach((name, i) => {
    const card = document.createElement("div");
    card.className = "recap-card";
    card.innerHTML = `<div class="recap-title">${name}</div>`;
    teamFrag.appendChild(card);

    if (i < 8) {
      const initials = name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .slice(0, 2)
        .toUpperCase();
      const face = document.createElement("div");
      face.className = "face";
      face.textContent = initials;
      facesFrag.appendChild(face);
    }
  });

  if (names.length > 8) {
    const more = document.createElement("div");
    more.className = "face more";
    more.textContent = `+${names.length - 8}`;
    facesFrag.appendChild(more);
  }

  if (teamContainer) {
    teamContainer.innerHTML = "";
    teamContainer.appendChild(teamFrag);
  }
  if (facesContainer) facesContainer.appendChild(facesFrag);
}

// date stuff
function getReadableDate(date) {
  return date.toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function getReadableTime(date) {
  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });
}

init().catch(console.error);
