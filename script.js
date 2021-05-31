const Client_id = '999917681683-gdrcgkriod2gp5v0og1cshhim141tdov.apps.googleusercontent.com';
const Discover_docs = ['https://www.googleapis.com/discovery/v1/apis/youtube/v3/rest'];
const Scopes = 'https://www.googleapis.com/auth/youtube';

const authorizeButton = document.getElementById('authorize-button');
const signoutButton = document.getElementById('signout-button');

const channelform = document.getElementById('channel-form');
const channeldata = document.getElementById('channel-data');
const videos = document.getElementById('video-container');

const defaultChannel = 'techguyweb';

//Load Auth2 library

function handleClientLoad(){
    gapi.load('client:auth2', initClient)
}

// Init API Client library and set up sign in listeners

function initClient(){
    gapi.client.init({
        discoveryDocs: Discover_docs.concat,
        clientId: Client_id,
        scope: Scopes
    }).then(() => {
        // Listen for sign in state changes

        gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus)
        // Handle intial sign in state

        updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get())
        authorizeButton.onclick = handleAuthClick;
        signoutButton.onclick = handleSignoutClick;
    })
}

// Update UI sign in state changes

function updateSigninStatus(isSignedIn){
    if(isSignedIn) {
         getChannel(defaultChannel)
    } else {
        videos.style.display = 'none';
        channeldata.style.display='none';
    }
}

// Handle login 

function handleAuthClick(){
    gapi.auth2.getAuthInstance().signIn();
}

// Handle logout 
function handleSignoutClick() {
    gapi.auth2.getAuthInstance().signOut()
}

// Get channel from  API 
function getChannel(channel){
    console.log(channel);
}


















