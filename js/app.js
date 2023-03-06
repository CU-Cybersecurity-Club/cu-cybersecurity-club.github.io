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
    
    const db = firebase.firestore();
    const members = await getMembers(db);
    addMembers(members.data());
}



async function getMembers(db) {
    var members = [];
    let querySnapshot = await db.collection("team").get();
    querySnapshot.forEach((doc) => {
        if(doc.id == "members")
            members = doc;
    });
    return members;
}

function addMembers(members) {
    const member_names = members.names;
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