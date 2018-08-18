
var song = "";
var artist = '';
$(document).on("click", "#search", function (event) {
     song = $("#song-input").val().trim();
     artist = $("#artist-input").val().trim();
    event.preventDefault();
    console.log("button clicked");
    console.log(song);
    console.log(artist);
    getLyrics();
    getYTVideo ();
    showEvents ();
});

function getLyrics () {
var queryURL = "https://api.musixmatch.com/ws/1.1/track.search?format=jsonp&callback=callback&q_track="+song+ "&q_artist="+ artist + "&quorum_factor=1&apikey=cad5fbf7afb8c5ce846d140b38ac51ef"

$.ajax({
    url: queryURL,
    method: "GET",
    dataType: "jsonp",
    jsonp: "callback"
}).then(function (result) {
    var trackId = result.message.body.track_list[0].track.track_id;
    var trackImg = result.message.body.track_list[0].track.album_coverart_100x100
    console.log(result);
    console.log(trackId)
    $("#album-art img").attr("src", trackImg);
    
    var queryURL2 = "https://api.musixmatch.com/ws/1.1/track.lyrics.get?format=jsonp&callback=callback&track_id=" + trackId + "&apikey=cad5fbf7afb8c5ce846d140b38ac51ef";

    $.ajax({
        url: queryURL2,
        method: "GET",
        dataType: "jsonp",
        jsonpCallback: 'jsonp_callback',
        contentType: 'application/json'
        // jsonp: "callback"
    }).then(function (response) {
        console.log(response);
        var lyrics = response.message.body.lyrics.lyrics_body
        // var lyricsBody = response.message.body.lyrics.lyrics_body.split(/\s+/).slice(0,125).join(" ")+ "...";
        // var commercial = response.message.body.lyrics.lyrics_body.split(/\s+/).slice(125,135).join(" ");
        if (lyrics == undefined) {
            $("#showlyrics").html("<h4> No lyrics available for this song</h4> ");
        }
        else {
        $("#showlyrics").html("<h4>" + lyrics + "</h4> ");
        $("#artist-name").text(artist);
        }


    });
});
};

function getYTVideo () {


    var ytAPI = "AIzaSyBglfIEbCdN-ZisKCm9RqzCqPKWDIKViAY"
    var input = song + " " + artist


console.log (input);
var ytURL = "https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=3&q="+input+"&type=video&key=" + ytAPI


$.ajax({
    url: ytURL,
    method: "GET",

}).then(function (data) {
    console.log(data);
    console.log(data.items[0].id.videoId)

    var videoId = data.items[0].id.videoId;
    var videoId2 = data.items[1].id.videoId;
    var videoId3 = data.items[2].id.videoId;

    $(".player").html('<iframe width="560" height="315" src="https://www.youtube.com/embed/' + videoId + '"frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>')
    $(".topVideo1").html('<iframe width="560" height="315" src="https://www.youtube.com/embed/' + videoId2 + '"frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>')
    $(".topVideo2").html('<iframe width="560" height="315" src="https://www.youtube.com/embed/' + videoId3 + '"frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>')
});

};

// var eventApi = "tD62X5BR9sf5WDs3"
// var eventURL = "http://api.eventful.com/rest/events/search?...&keywords=books&location=San+Diego&date=Future"

var flickrApi = "47a3a388513c01bbd7dc9cd77581ec75"
var secret = "caf4cddcd4a12f20"
var flick  = "https://farm{farm-id}.staticflickr.com/{server-id}/{id}_{secret}_m.jpg"
var flickURL = "https://api.flickr.com/services/feeds/photos_public.gne?tags=kitten&format=json&"

// add function to retrieve upcoming events from ticketmaster API for artist

function showEvents () {


var queryURL2 = "https://app.ticketmaster.com/discovery/v1/events.json?keyword="+artist+"&apikey=e24yU8pGFGdyS4VeZAsidGfIG7yZwce1";

$.ajax({
    url: queryURL2,
    method: "GET",
      
}).then(function (response) {
    var ticketMasterEvents = JSON.stringify(response)
    console.log(response);
    console.log(response._embedded.events);
    var events = response._embedded.events;
    for (var i=0; i < events.length; i++) {
        console.log(events[i].name);
        var eName = events[i].name
        var eLocation = events[i]._embedded.venue[0].name + " " + events[i]._embedded.venue[0].city.name + ", " + events[i]._embedded.venue[0].state.stateCode;
        var eDate = events[i].dates.start.dateTime;
        var eDatef = moment(eDate).format('llll')
        var $button = $("<button>").text("More Info")
        var eventLink = events[i].eventURL
        var eInfo = $button;
        console.log(eventLink);
        var newRow = $("<tr>").append(
            $("<td>").text(eName),
            $("<td>").text(eLocation),
            $("<td>").text(eDatef),
            $("<td>").html(eInfo)
          );
          // Append the new row to the table
          $("#eventsdata").append(newRow);
    }

}); 

}