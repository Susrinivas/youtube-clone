const Client_id = '999917681683-gdrcgkriod2gp5v0og1cshhim141tdov.apps.googleusercontent.com';
const Discover_docs = ['https://www.googleapis.com/discovery/v1/apis/youtube/v3/rest'];
const Scopes = 'https://www.googleapis.com/auth/youtube';
const Api_key = 'AIzaSyDgxU13QcmLImQNFFW-jPkdj9pAtrebvEc';
const authorizeButton = document.getElementById('authorize-button');
const signoutButton = document.getElementById('signout-button');

const channelform = document.getElementById('channel-form');
const channeldata = document.getElementById('channel-data');
const videos = document.getElementById('video-container');

let defaultChannel = 'UC29ju8bIPH5as8OGnQzwJyA';

channelform.addEventListener('submit', e => {
    e.preventDefault();
    const channel1 = document.getElementById('channel_input').value;
    console.log(channel1);
    //getChannel(channel1);
    topicBasedSearching(channel1);
})

const home = document.getElementById('home')
home.addEventListener('click', () => {
    const channel1 = document.getElementById('channel_input').value;
    console.log(channel1);
    
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
        console.log('initclient')
        gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus)
        // Handle intial sign in state

        updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get())
        authorizeButton.onclick = handleAuthClick;
        signoutButton.onclick = handleSignoutClick;
    })
}

// Update UI sign in state changes

function updateSigninStatus(isSignedIn){
    console.log('updatestatus')
    console.log("1")
    console.log(isSignedIn)
    if(isSignedIn) {
      getChannel(defaultChannel)
    } else {
        console.log('2')
        videos.style.display = 'none';
        channeldata.style.display='none';
    }
}

// Handle login 
let login = document.getElementsByClassName('login')[0];
let logout = document.getElementsByClassName('logout')[0];

function handleAuthClick(){
    console.log('authclick')
    gapi.auth2.getAuthInstance().signIn();
    console.log(gapi)
    login.style.display='none'
    logout.style.display='block';
}

// Handle logout 
function handleSignoutClick() {
    gapi.auth2.getAuthInstance().signOut()
    login.style.display='block';
    logout.style.display='none';
}

// Get channel from  API 
 var channel = '';
function getChannel(channelt){
   gapi.client.youtube.channels.list({
       part: 'snippet,contentDetails,statistics',
       //forUsername: channelt,
       id: channelt
      }).then(response => {
       console.log(response);
        channel= response.result.items[0];
        if(channelt == defaultChannel ){
        showVideos(channel);
        }
      }).catch(err => alert('No channel By that name ..'))
}

// function getChannelfromSearch(channelt){
//     gapi.client.youtube.channels.list({
//         part: 'snippet,contentDetails,statistics',
//         //forUsername: channelt,
//         id: channelt
//        }).then(response => {
//         //console.log(response);
//          channel= response.result.items[0];
//          console.log(response);
//          return response;
//        })
//     .catch(err => alert('No channel By that name seatrch'))
//  }
 

function retriveInfo() {
    videoContainer.innerHTML = '';
    console.log(channel)
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

function showVideos(channel){
    
    const requestoptions = {
        part: 'snippet',
        playlistId: channel.contentDetails.relatedPlaylists.uploads,
        maxResults: 16
    }
   console.log('data');
    const request = gapi.client.youtube.playlistItems.list(requestoptions);
    
    request.execute(response => {

        console.log(response);
        const playlistitems = response.result.items;
        if(playlistitems){
            let  res = "<h4 class='center-align'></h4>";
            playlistitems.forEach(item => {
           let VideoId = item.snippet.resourceId.videoId;

           res +=  `
                   <div class='col-3 history' id=${VideoId} >
                   <iframe  width="100%" height="250" src="https://www.youtube.com/embed/${VideoId}" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
                   <p>${channel.snippet.title}</p>
                   <button onclick='updatePlaylist(${channel.snippet.title}, ${channel.snippet.description}, ${channel.contentDetails.relatedPlaylists.uploads})'>Add to playlist</button>
                   <hr>
                   <br>
                   </div>
           ` ;
         })
         
         videoContainer.innerHTML = res;
        }else{
            videoContainer.innerHTML = 'No Uploaded Videos';
            
        }
    })

}

    // function topicBasedSearching(channel){
    //     console.log('topic')
    //     gapi.client.youtube.search.list({
    //         part: 'snippet,contentDetails,statistics',
    //         topicId: '/m/01h6rj',
    //     }).then(response => {
    //         console.log(response);
    //          channel= response.result.items[0];
    //          Topic(response)
             
    //        })
    //     .catch(err => alert('No channel By that name'))
    //  }
    
     
     function topicBasedSearching(resp){
        gapi.client.youtube.search.list({
            part: 'snippet',
            q: `${resp}`,
           maxResults: 16,
           }).then(response => {
                    console.log(response);
                    Topic(response)
         })
                .catch(err => alert('No channel By that name yes'))
        }

      var playlisttitle = '';
      var plalistdescription = '';
        function Topic(resp){
       
            console.log(resp);
            const listitems = resp.result.items;
            if(listitems){
                let  r = "<h4 class='center-align'></h4>";
                listitems.forEach(item => {
               let videoid = item.id.videoId;
               
               r +=  `
                       <div class='col-3 history' id=${videoid} >
                       <iframe  width="100%" height="250" src="https://www.youtube.com/embed/${videoid}" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
                       <object class='fit' data=${item.snippet.thumbnails.default.url}>
                       </object>
                       <p>${item.snippet.title}</p>
                       <p style='display:inline;'>${item.snippet.channelTitle} </p>
                       <button onclick='updatePlaylist(${item.snippet.title}, ${item.snippet.description}, ${videoid}, ${item.snippet.playlistId})'>Add to playlist</button>
                       <hr>
                       <br>
                       </div>
                       
                     
               ` ;
               
                     getChannel(item.snippet.channelId);
               
                })
             
             videoContainer.innerHTML = requestAnimationFrame;
            }else{
               // videoContainer.innerHTML = 'No Uploaded Videos';
                
            }
            
        }
        var histvideos = '';

        let hist = document.getElementsByClassName('history');
      //let j=0;

        for(var i=0; i<hist.length; i++){
          //console.log('event',j++)
         hist[i].addEventListener('click', event => {
         
               let video_id = event.target.id;
               histvideos +=  `
                       <div class='col-3'>
                       <iframe  width="100%" height="250" src="https://www.youtube.com/embed/${video_id}" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
                       <hr>
                       <br>
                       </div> ` ;
                      

          } )
        }
      
       
        
        // function history(video){
        //   console.log('histvideos')   
        //   histvideos +=  `
        //                <div class='col-3'>
        //                <iframe  width="100%" height="250" src="https://www.youtube.com/embed/${video.id}" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
                       
        //                <hr>
        //                <br>
        //                </div>
                     
        //        ` ;

         

        // }

        function displayHistory(){
          console.log(histvideos)
          videoContainer.innerHTML = histvideos;
          console.log('displayh')
        }

        //playlist creation & updation
  //var myplaylistId ='';
  
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
    console.log(titleVal,descript);
    Createplaylist(titleVal,descript);
  }


  function Createplaylist(title,description){
         
            console.log('playlist')
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
                    myplaylistId = response.result.id;
                    console.log(myplaylistId);
                }).catch(err => {
                    console.log('error')
                })
            }

            function updatePlaylist(title, description,  myplaylistid) {
                gapi.client.youtube.playlists.update({
                  "part": [
                    "snippet,status"
                  ],
                  "resource": {
                    "id": `${myplaylistid}`,
                    "snippet": {
                      "title": `${title}`,
                      "description": `${description}`,
                      "tags": [
                        "updated playlist",
                        "API FTW"
                      ]
                    },
                    "status": {
                      "privacyStatus": "private"
                    }
                  }
                }).then(response => {
                    console.log(response)
                }).catch(err => {
                    console.log('error')
                })
            }


            function addVideotoPlaylist() {
                gapi.client.youtube.playlistItems({
                  "part": [
                    "snippet,status"
                  ],
                  "resource": {
                    "id": `${myplaylistId}`,
                    "snippet": {
                      "title": "Updated sample playlist created via API",
                      "description": "This is the updated playlist description.",
                      "tags": [
                        "updated playlist",
                        "API FTW"
                      ]
                    },
                    "status": {
                      "privacyStatus": "private"
                    }
                  }
                }).then(response => {
                    console.log(response)
                }).catch(err => {
                    console.log('error')
                })
            }

    
    






















