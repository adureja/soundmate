var stream = new Audio();

var song = "Paste a soundcloud track link and click Generate.";
var artist = "Click play once the song recommendation loads!";
var permURL = "";
var apiURL = "";

var isLoaded = "Not Loaded";
var trackLink;
var playing = false;

var origLink = true;

var clientAPIKey = ''; //insert client API key here


function resolveAndPlayURL(trackURL) {
    var xhr2 = new XMLHttpRequest();
    client_id = '?client_id=' + clientAPIKey;
    xhr2.open('GET', trackURL);
    xhr2.onload = function(){
        var track = JSON.parse(xhr2.responseText);
        song = track.title;
        artist = track.user.username;
        stream.src = track.stream_url + client_id;
        setTimeout(function(){ stream.play(); }, 2000);
    }; 
    xhr2.send();
};

chrome.runtime.onMessage.addListener(
	function(response, sender, sendResponse) {
        console.log(response);
        var test1 = JSON.parse(response);
        console.log(test1);
        if (test1.toggle === "Play") {
            stream.play();
            console.log(test1.playing);
            playing = test1.playing;
            console.log(playing);
        } else if (test1.toggle === "Pause") {
            stream.pause();
        } else if (test1.toggle === "FF") {
            stream.pause();
            resolveAndPlayURL(trackLink);
            console.log(trackLink);
            return true;
        } else if (typeof test1.permLink !== 'undefined') {
            if (permURL != test1.permLink) {
                permURL = test1.permLink;
                origLink = false;
            }
            apiURL = test1.apiLink;
            console.log(apiURL);
        } else {
            isLoaded = "Loaded! Press play.";
            trackLink = test1.preStream;
            console.log(trackLink);
            resolveAndPlayURL(trackLink);
            return true;
        }
	}
);
