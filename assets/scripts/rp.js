//Capture the star ratings
var onStar = "";
var stars = "";
$(document).ready(function () {

    /* 1. Visualizing things on Hover - See next part for action on click */
    $('.fa').on('mouseover', function () {
        var onStar = parseInt($(this).data('value'), 10); // The star currently mouse on
        console.log("mouseover");

        // Now highlight all the stars that's not after the current hovered star
        $(this).parent().children().each(function (e) {
            if (e < onStar) {
                $(this).addClass('hover');
            }
            else {
                $(this).removeClass('hover');
            }
        });

    }).on('mouseout', function () {
        $(this).parent().children().each(function (e) {
            $(this).removeClass('hover');
        });
    });


    /* 2. Action to perform on click */
    $('.fa').on('click', function () {
        onStar = parseInt($(this).data('value'), 10); // The star currently selected
        stars = $(this).parent().children();

        for (i = 0; i < stars.length; i++) {
            $(stars[i]).removeClass('checked');
        }

        for (i = 0; i < onStar; i++) {
            $(stars[i]).addClass('checked');
            console.log(onStar);
            $("#rated").text("You rated this video " + onStar + " stars");
        }


    });

});

//End capture of stars rating

//Begin functions to get music lyrics, video, and events through Musix Match, YouTube, and Ticketmaster API's

var song = "";
var artist = '';
$(document).on("click", "#search", function (event) {
    song = $("#song-input").val().trim();
    artist = $("#artist-input").val().trim();
    if (!song && !artist) {
    // Alert if song or artist is blank
    // When the user clicks the button, open the modal
    // Get the <span> element that closes the modal
    var modal = $('#myModal');
    var span = $(".close")[0];
    modal.css("display", "block");

    // When the user clicks on <span> (x), close the modal
    span.onclick = function () {
        modal.css("display", "none");
    }

    // When the user clicks anywhere outside of the modal, close it
    window.onclick = function (event) {
        if (event.target == modal) {
            modal.css("display", "none");
        }
    }
    }


    $(".fa").removeClass('checked');
    $("#rated").text("Rate this video");
    event.preventDefault();
    console.log("button clicked");
    console.log(song);
    console.log(artist);
    getLyrics();
    getYTVideo();
    $("#eventsdata").empty();
    showEvents();
    $(".comment-box").show();
    $(".savedReviews").hide();
});
// The first API is used to get a track id based on artist name and song. Track ID is required to get lyrics.
function getLyrics() {
    var queryURL = "https://api.musixmatch.com/ws/1.1/track.search?format=jsonp&callback=callback&q_track=" + song + "&q_artist=" + artist + "&quorum_factor=1&apikey=cad5fbf7afb8c5ce846d140b38ac51ef"

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
            var lyrics = JSON.stringify(response.message.body.lyrics.lyrics_body, 2, null);

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

// function to get YouTube Video based on Song and Artist selected as keywords
function getYTVideo() {


    var ytAPI = "AIzaSyBglfIEbCdN-ZisKCm9RqzCqPKWDIKViAY"
    var input = song + " " + artist


    console.log(input);
    var ytURL = "https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=3&q=" + input + "&type=video&key=" + ytAPI


    $.ajax({
        url: ytURL,
        method: "GET",

    }).then(function (data) {
        // console.log(data);
        console.log(data.items[0].id.videoId)

        var videoId = data.items[0].id.videoId;
        var videoId2 = data.items[1].id.videoId;
        var videoId3 = data.items[2].id.videoId;

        // Add videos to screen
        $('.top-video').text("Other Top Videos for " + artist)
        $(".player").html('<iframe width="560" height="315" src="https://www.youtube.com/embed/' + videoId + '"frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>')
        $(".topVideo1").html('<iframe width="560" height="315" src="https://www.youtube.com/embed/' + videoId2 + '"frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>')
        $(".topVideo2").html('<iframe width="560" height="315" src="https://www.youtube.com/embed/' + videoId3 + '"frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>')
    });

};


// add function to retrieve upcoming events from ticketmaster API for artist

function showEvents() {


    var queryURL2 = "https://app.ticketmaster.com/discovery/v1/events.json?keyword=" + artist + "&apikey=e24yU8pGFGdyS4VeZAsidGfIG7yZwce1";

    $.ajax({
        url: queryURL2,
        method: "GET",

    }).then(function (response) {
        $("#upcoming-events").text("Upcoming Events for artist " + artist);
        var ticketMasterEvents = JSON.stringify(response)
        // console.log(response);
        // console.log(response._embedded.events);
        var events = response._embedded.events;
        for (var i = 0; i < events.length; i++) {
            // console.log(events[i].name);
            var eName = events[i].name
            var eLocation = events[i]._embedded.venue[0].name + " " + events[i]._embedded.venue[0].city.name + ", " + events[i]._embedded.venue[0].state.stateCode;
            var eDate = events[i].dates.start.dateTime;
            var eDatef = moment(eDate).format('llll')
            var eventLink = "https://www.ticketmaster.com/" + events[i]._embedded.attractions[0].url;
            var $button = $("<button>").html('<a target = "_blank" href=' + eventLink + '>More Info </a>');
            // var eInfo = $button.attr("href",eventLink);
            var eInfo = $button.addClass("btn");
            // console.log(eventLink);
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
//Clear contact form after submit
function clearForm (event) {
    $("#name").val("");
    $("#email").val("");
    $("#company").val("");
    $("#message").val("");

    // Alert submission received with a modal
    // When the user clicks the button, open the modal
    // Get the <span> element that closes the modal
    var modal = $('#myModal2');
    var span = $(".close2")[0];
    modal.css("display", "block");

    // When the user clicks on <span> (x), close the modal
    span.onclick = function () {
        modal.css("display", "none");
    }

    // When the user clicks anywhere outside of the modal, close it
    window.onclick = function (event) {
        if (event.target == modal) {
            modal.css("display", "none");
        }
    }
};

// Collect review data into Firebase
// Initialize Firebase
var config = {
    apiKey: "AIzaSyDrWIRizkRmAuyQ_EDZkd3oQrDzMmJPFdY",
    authDomain: "rottenpotatoes-213015.firebaseapp.com",
    databaseURL: "https://rottenpotatoes-213015.firebaseio.com",
    projectId: "rottenpotatoes-213015",
    storageBucket: "rottenpotatoes-213015.appspot.com",
    messagingSenderId: "784045909832"
};
firebase.initializeApp(config);

if (!firebase.apps.length) {
    firebase.initializeApp(config);
};

var database = firebase.database();

// 2. Button for submitting Review
$(document).on("click", "#submitReview", function (event) {
    event.preventDefault();

    // Grabs user input and pushes to database
    var review = $("#review").val().trim();

    // Creates local "temporary" object for holding comments
    reviewComment = {
        artist: artist,
        song: song,
        rating: onStar,
        review: review
    };
    database.ref().push(reviewComment);
    console.log(reviewComment);

    //Clear comment box
    $("#review").val("");


    //Display comments after review is submitted
    // 3. Create Firebase event for adding a row in the html when a user adds an entry
    // Since multiple listeners may be attached the firebase "on' event, on page load or reauthentication etc.
    // We must first remove the existing listener before attaching new listener.
    // In firebase call off() event before on() event to fix this.
    database.ref().off();
    database.ref().orderByChild('timeCreated').limitToLast(5).on("child_added", function (snap) {
        
        console.log(snap.val());

        // Store everything into a variable.
        var artistName = snap.val().artist;
        var songName = snap.val().song;
        var rating = snap.val().rating;
        var comment = snap.val().review;

        //create paragraph to display comment
        var $p = $("<p>").addClass("savedReviews");
        var displayComment = $p.html("Song:<em>  " + songName + "</em> by <em>" + artistName + "</em> was rated <u>" + rating +
            " stars</u> with the following review <em>comment:</em> " + comment)

        // clear contents and hide comment box then replace with display comment
        $(".comment-box").hide();
        $(".comments").append(displayComment);
  
    });

});

// form validation
function validateForm() {
    var x = document.forms["contactForm"]["fname"].value;
    if (x == "") {
        alert("Name must be filled out");
        return false;
    }
}

// Button for submitting Contact Info

$(document).on("click", "#submit", function (event) {
    

    var name = $("#name").val().trim();
    var email = $("#email").val().trim();
    var favArtist = $("#company").val().trim();
    var message = $("#message").val().trim();

    // Creates local "temporary" object for holding comments
    contacts = {
        name: name,
        email: email,
        favArtist: favArtist,
        message: message
    };
    // database.ref().push(contacts);
    console.log(contacts);
    clearForm ();

});
