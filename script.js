const Client_id = '999917681683-gdrcgkriod2gp5v0og1cshhim141tdov.apps.googleusercontent.com';
const Discover_docs = ['https://www.googleapis.com/discovery/v1/apis/youtube/v3/rest'];
const Scopes = 'https://www.googleapis.com/auth/youtube';
const Api_key = 'AIzaSyDgxU13QcmLImQNFFW-jPkdj9pAtrebvEc';
const authorizeButton = document.getElementById('authorize-button');
const signoutButton = document.getElementById('signout-button');


const channelform = document.getElementById('channel-form');
const channeldata = document.getElementById('channel-data');
const videos = document.getElementById('video-container');

let defaultChannel = 'UC_x5XG1OV2P6uZZ5FSM9Ttw';

channelform.addEventListener('submit', e => {
    e.preventDefault();
    const channel1 = document.getElementById('channel_input').value;
    
    //getChannel(channel1);
    topicBasedSearching(channel1);
})

const home = document.getElementById('home')
home.addEventListener('click', () => {
    const channel1 = document.getElementById('channel_input').value;
    
    
    channeldata.innerHTML = '';
   if(!channel1){
        getChannel(defaultChannel);
    }else {
        topicBasedSearching(channel1);
    }
})
//Load Auth2 library

function handleClientLoad(){
    gapi.load('client:auth2', initClient)
}

// Init API Client library and set up sign in listeners

function initClient(){
    gapi.client.init({
        discoveryDocs: Discover_docs,
        clientId: Client_id,
        scope: Scopes,
        apiKey: Api_key
    }).then(() => {
        // Listen for sign in state changes
        gapi.client.setApiKey(Api_key)
        
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
        signoutButton.style.display="block";
        authorizeButton.style.display="none";
        getChannel(defaultChannel);
    } else {
       
        authorizeButton.style.display="block";
        signoutButton.style.display="none";
        videos.style.display = 'none';
        channeldata.style.display='none';
    }
}

// Handle login 
let login = document.getElementsByClassName('login')[0];
let logout = document.getElementsByClassName('logout')[0];
function handleAuthClick(){
    
    gapi.auth2.getAuthInstance().signIn();
    
    login.style.color='red'
    logout.style.color='black';
}

// Handle logout 
function handleSignoutClick() {
    gapi.auth2.getAuthInstance().signOut()
    login.style.color='black';
    logout.style.color='red';
}

// Get channel from  API 
 var channel = '';



 // functionality to Retrieve channel information

function getChannel(channelt){
   gapi.client.youtube.channels.list({
       part: 'snippet,contentDetails,statistics',
       //forUsername: channelt,
       id: channelt
      }).then(response => {
       channel= response.result.items[0];
        if(channelt == defaultChannel ){
        showVideos(channel);
        }
      })
   .catch(err => alert('No channel By that name ..'))
}

// functionality to Retrieve Subscriptions and user activity.


function retriveInfo() {
    videoContainer.innerHTML = '';
   const output = `<ul class='collections'>
  <li class='collection-item'><span class='text-style'>Title: </span> ${channel.snippet.title}</li>
  <li class='collection-item'><span class='text-style'>Channel ID:</span> ${channel.id}</li>
  <li class='collection-item'><span class='text-style'>Channel Subscriber Count: </span> ${channel.statistics.subscriberCount}</li>
  <li class='collection-item'><span class='text-style'>Channel Video Count:</span> ${channel.statistics.videoCount}</li>
  <li class='collection-item'><span class='text-style'>Channel View Count:</span> ${channel.statistics.viewCount}</li>
  </ul>
  <hr>
  <br><br>
  <hr>
  <p style"text-align: justify;">${channel.snippet.description}</p>`

  document.getElementById('channel-data').innerHTML = output;
}


const videoContainer = document.getElementById('video-container')

// functionality to Uploaded videos and system-generated playlists



function showVideos(channel){
    
    const requestoptions = {
        part: 'snippet',
        playlistId: channel.contentDetails.relatedPlaylists.uploads,
        maxResults: 16
    }
   
    const request = gapi.client.youtube.playlistItems.list(requestoptions);
    
    request.execute(response => {

       
        const playlistitems = response.result.items;
        if(playlistitems){
            let  res = "<h4 class='center-align'></h4>";
            playlistitems.forEach(item => {
           const videoId = item.snippet.resourceId.videoId;

           res +=  `
                   <div4 class='col-3 history' id=${videoId}>
                   <iframe class='myframe' width="100%" height="250" src="https://www.youtube.com/embed/${videoId}" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
                   <p>${channel.snippet.title}</p>
                   </div4>
           ` ;
         })
         
         videoContainer.innerHTML = res;
        }else{
            videoContainer.innerHTML = 'No Uploaded Videos';
            
        }
    })

}

    //Create functionality for topic based searching and search for playlists or channels


    
     
     function topicBasedSearching(resp){
        gapi.client.youtube.search.list({
            part: 'snippet',
            q: `${resp}`,
           maxResults: 16,
           }).then(response => {
                    Topic(response)
         })
                .catch(err => alert('No channel By that name yes'))
        }


        function Topic(resp){
       
            
            const listitems = resp.result.items;
            if(listitems){
                let  res = "<h4 class='center-align'></h4>";
                listitems.forEach(item => {
               const videoid = item.id.videoId;
               res +=  `
                       <div4 class='col-3'   id=${videoid}>
                       <iframe  class='myframe' width="100%" height="250" src="https://www.youtube.com/embed/${videoid}" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
                      <object class='fit' data=${item.snippet.thumbnails.default.url}>
                       </object>
                       <p>${item.snippet.title}</p>
                       <p style='display:inline;'>${item.snippet.channelTitle} </p>
                       </div4>
               ` ;
                 getChannel(item.snippet.channelId);
               
                })
             
             videoContainer.innerHTML = res;
            }else{
                videoContainer.innerHTML = 'No Uploaded Videos';
                
            }
             
            
        }

        
        //  functionality to create and update a playlist. 




        function playlist(){
            document.getElementById('channel-data').innerHTML = '';
         
            let content = `<form id='create_playlist' onsubmit=formsubmit(event)>
            <input type='text' class='form-control title mb-3 mx-auto'>
            <input type='text' class='form-control description mb-3 mx-auto'>
            <button type='submit' class='btn btn-primary'>Submit</button>
            </form>`
            videoContainer.innerHTML = content;
             
          }
           
          
          var form1 = document.getElementById('create_playlist');
        
         function formsubmit(e) {
            e.preventDefault();
            let titleVal = document.getElementsByClassName('title')[0].value;
            let descript = document.getElementsByClassName('description')[0].value;
           
            Createplaylist(titleVal,descript);
          }
        
        
          function Createplaylist(title,description){
                 
                   
                     gapi.client.youtube.playlists.insert({
                          'part' : 'snippet,status',
                          "resource": {
                            "snippet": {
                              "title": `${title}`,
                              "description": `${description}`,
                              "tags": [
                                "sample playlist",
                                "API call"
                              ],
                              "defaultLanguage": "en"
                            },
                            "status": {
                              "privacyStatus": "private"
                            }
                          }
                       
                        }).then(response => {
                            console.log(response);
                            myplaylistId = response.result.snippet.channelId;
                            console.log(myplaylistId);
                        }).catch(err => {
                            console.log('error')
                        })
                    }
        
                    
