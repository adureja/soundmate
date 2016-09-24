document.addEventListener('DOMContentLoaded', function() {

    $('#song_info').html(chrome.extension.getBackgroundPage().song 
        + "<br />" + chrome.extension.getBackgroundPage().artist);

    $('#loaded').html(chrome.extension.getBackgroundPage().isLoaded)

    $('#link').val(chrome.extension.getBackgroundPage().permURL);

    var playing = chrome.extension.getBackgroundPage().playing;

    var clientAPIKey = ""; //insert soundcloud API key here

    function resolveURL(userTrackURL) {
        console.log(userTrackURL);
        var apiCall = new XMLHttpRequest();
        client_id1 = "&client_id=" + clientAPIKey;
        var apiResolve = "https://api.soundcloud.com/resolve?url=" + userTrackURL + client_id1;
        console.log(apiResolve);
        apiCall.open("GET", apiResolve, true);
        apiCall.onload = function() {
            var response1 = JSON.parse(apiCall.responseText);
            var linkObj = function() {
                this.permLink = response1.permalink_url;
                this.apiLink = response1.uri;
            }
            var linkJSON = new linkObj();
            var linkString = JSON.stringify(linkJSON);
            chrome.runtime.sendMessage(linkString);
            $('#loaded').html("Loaded! Press play.");
        }
        apiCall.send(); 
    }

    function populateArray() {
        var xhr = new XMLHttpRequest();
        client_id = "?client_id=" + clientAPIKey;
        console.log(chrome.extension.getBackgroundPage().apiURL);
        xhr.open("GET", chrome.extension.getBackgroundPage().apiURL + "/related" + client_id, true);
        xhr.onload = function() {
            var response = JSON.parse(xhr.responseText);
            var idIndex = Math.floor(Math.random() * response.length);
            console.log(idIndex);

            trackURL = response[idIndex].uri;
            song = response[idIndex].title;
            artist = response[idIndex].user.username;
            $('#song_info').html(song + "<br />" + artist);

            var message = trackURL + client_id;

            var psObj = function() {
                this.preStream = message;
            }
            var psJSON = new psObj();
            var psString = JSON.stringify(psJSON);
            chrome.runtime.sendMessage(psString);
        }
        xhr.send();
    }

    $('#checkPage').click(function() {
        pasteLink = document.getElementById("link").value;
        resolveURL(pasteLink);
    });

    $('#Play').click(function() {
        console.log(playing);
        if (playing != true) {
            playing = true;
            populateArray();
        }
        var playObj = function() {
            this.toggle = "Play";
            this.playing = true;
        }
        var playJSON = new playObj();
        var playString = JSON.stringify(playJSON);
        chrome.runtime.sendMessage(playString);
        $('#loaded').html("Loaded! Press play."); 
    })

    $('#Pause').click(function() {
        var pauseObj = function() {
            this.toggle = "Pause";
        }
        var pauseJSON = new pauseObj();
        var pauseString = JSON.stringify(pauseJSON);
        chrome.runtime.sendMessage(pauseString);       
    })

    $('#FF').click(function() {
        populateArray();
        var ffObj = function() {
            this.toggle = "FF";
        }
        var ffJSON = new ffObj();
        var ffString = JSON.stringify(ffJSON);
        chrome.runtime.sendMessage(ffString);
    })

});


