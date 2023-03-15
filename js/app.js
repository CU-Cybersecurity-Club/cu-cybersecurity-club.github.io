var db = null;

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
        // Initialize Firebase
    firebase.initializeApp(firebaseConfig);
    firebase.analytics();
    
    db = firebase.firestore();
    
    addMembers();
    initSemSelector();
    await addAllEvents();

}



async function addMembers() {
    let querySnapshot = await db.collection("team").doc("members").get();
    if(!querySnapshot.exists) return; 
    
    const member_names = querySnapshot.data().names;
    const parent_section = document.getElementById("section-62ef6ed65edaa");
    for (let i = 0; i < member_names.length; i++) {
        const member_name = member_names[i];
        const member_outer_div = document.createElement("div");
        member_outer_div.className = "col-lg-4 col-md-5 s123-col-centered";
        member_outer_div.innerHTML = `
        <div class="team-member s123-box-clean preview-highlighter" data-unique-id="${makeid(13)}">
            <div class="team-details"><div><h4 class="member-name">${member_name}</h4></div></div></div>
        `;
        parent_section.appendChild(member_outer_div);
    }
}

async function addAllEvents() {
    const querySnapshot = await db.collection("events").get();
    querySnapshot.forEach((doc) => {
        const events = doc.data().details;
        renderEvents(events);
    });
}

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

function makeid(length) {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < length) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
      counter += 1;
    }
    return result;
}


function getReadableDate(date) {
    const monthNames = [
        "January", "February", "March",
        "April", "May", "June", "July",
        "August", "September", "October",
        "November", "December"
      ];
    
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

async function filterEventsBySemester(semester) {
    document.getElementById("upcoming-events").innerHTML = "";
    if(semester === "all") {
        await addAllEvents();
        return;
    }
    await addEventsBySemester(semester);
}

async function addEventsBySemester(semester) {
    const querySnapshot = await db.collection("events").doc(semester).get();
    if(!querySnapshot.exists) return;
    const events = querySnapshot.data().details;
    renderEvents(events);
}

function renderEvents(events) {

    for (let i = 0; i < events.length; i++) {
        const event = events[i];
        const event_date = event.time.toDate();

        const event_outer_div = document.createElement("div");
        event_outer_div.setAttribute("data-unique-id", makeid(13));
        event_outer_div.className = "event clearfix box-primary preview-highlighter";


        const event_details_div = document.createElement("div");
        event_details_div.className = "event-details";
        
        const event_title_div = document.createElement("div");
        event_title_div.className = "event-title";
        event_title_div.innerHTML = `<h2>${event.name}</h2>`;

        const event_meta = document.createElement("ul");
        event_meta.className = "event-meta clearfix";
        
        const li_date = document.createElement("li");
        const li_location = document.createElement("li");
        let li_slides = document.createElement("li");
        let li_recording = document.createElement("li");
        let li_survey = document.createElement("li");

        li_date.innerHTML = `<i class="svg-m s123-icon-converter " data-icon-name="clock-o" style=" mask: url('https://static1.s123-cdn-static-a.com/ready_uploads/svg/clock-o.svg?v=2'); -webkit-mask: url('https://static1.s123-cdn-static-a.com/ready_uploads/svg/clock-o.svg?v=2');" data-ie11-classes="">&nbsp;</i>${getReadableDate(event_date)} @ ${getReadableTime(event_date)}`;
        li_location.innerHTML = `<i class="svg-m s123-icon-converter " data-icon-name="map-marker" style=" mask: url('https://static1.s123-cdn-static-a.com/ready_uploads/svg/map-marker.svg?v=2'); -webkit-mask: url('https://static1.s123-cdn-static-a.com/ready_uploads/svg/map-marker.svg?v=2');" data-ie11-classes="">&nbsp;</i>${event.location}`;
        
        if(!("slides" in event)) li_slides = null;
        else li_slides.innerHTML = `<a href="${event.slides}"><i class="svg-m s123-icon-converter " data-icon-name="desktop" style=" mask: url('https://static1.s123-cdn-static-a.com/ready_uploads/svg/desktop.svg?v=2'); -webkit-mask: url('https://static1.s123-cdn-static-a.com/ready_uploads/svg/desktop.svg?v=2');" data-ie11-classes="">&nbsp;</i><b>Slides</b></a>`

        if(!("recording" in event)) li_recording = null;
        else li_recording.innerHTML = `<a href="${event.recording}"><i class="svg-m s123-icon-converter " data-icon-name="video-camera" style=" mask: url('https://static1.s123-cdn-static-a.com/ready_uploads/svg/video-camera.svg?v=2'); -webkit-mask: url('https://static1.s123-cdn-static-a.com/ready_uploads/svg/video-camera.svg?v=2');" data-ie11-classes="">&nbsp;</i><b>Recording</b></a>`;
        
        if(!("survey" in event)) li_survey = null;
        else li_survey.innerHTML = `<a href="${event.survey}"><i class="svg-m s123-icon-converter " data-icon-name="list-alt" style=" mask: url('https://static1.s123-cdn-static-a.com/ready_uploads/svg/list-alt.svg?v=2'); -webkit-mask: url('https://static1.s123-cdn-static-a.com/ready_uploads/svg/list-alt.svg?v=2');" data-ie11-classes="">&nbsp;</i><b>Survey</b></a>`;

        event_meta.appendChild(li_date);
        event_meta.appendChild(li_location);
        if(li_slides) event_meta.appendChild(li_slides);
        if(li_recording) event_meta.appendChild(li_recording);
        if(li_survey) event_meta.appendChild(li_survey);

        event_details_div.appendChild(event_title_div);
        event_details_div.appendChild(event_meta);
        event_outer_div.appendChild(event_details_div);
        document.getElementById("upcoming-events").appendChild(event_outer_div);

    }
}