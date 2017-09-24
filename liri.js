const keys = require("./keys.js");

const request = require("request");
const spotify = require("node-spotify-api");
const twitter = require("twitter");
const fs = require("fs");

var spotifyAPI = new spotify({
  id: keys.spotifyKeys.id,
  secret: keys.spotifyKeys.secret
});

var appRequest = process.argv[2];
var nodeArgs = process.argv;

// capture user input after the application request position [2] and turn into string for query searches
for (var i = 3; i < nodeArgs.length; i++) {
  if (i > 3 && i < nodeArgs.length) {
    userRequest = userRequest + "+" + nodeArgs[i];
  } else {
    userRequest = nodeArgs[i];
  }
}

// show Artist(s), Song's Name, Preview link of song from Spotify, Album song is from
// default: Ace of Base
if (appRequest === "spotify-this-song") {
  spotifyAPI.search({ type: 'track', query: userRequest }, function(err, data) {
    // if error show default
    if (err) {
      console.log("Song requested does not exist.  Check out: ");
      spotifyAPI.search({ type: 'track', query: 'All That She Wants' }, function(err, data) {
        if (err) {
          return console.log('Error occurred: ' + err);
        }
        var defaultSong = data.tracks.items[0];
        console.log("Name of Artist(s): " + defaultSong.artists[0].name);
        console.log("Name of Song: " + defaultSong.name);
        if (!defaultSong.preview_url) {
          console.log("No preview link for song is available.")
        } else {
          console.log("Preview URL: " + defaultSong.preview_url);
        }
        console.log("Name of Album: " + defaultSong.album.name);
      })
      //if no error show request
    } else if (data) {
      var requestSong = data.tracks.items[0];
      console.log("Name of Artist(s): " + requestSong.artists[0].name);
      console.log("Name of Song: " + requestSong.name);
      if (!requestSong.preview_url) {
        console.log("No preview link for song is available.")
      } else {
        console.log("Preview URL: " + requestSong.preview_url);
      }
      console.log("Name of Album: " + requestSong.album.name);
    }
  });

}

// request gets 20 tweets - show last 20 tweets (or number of tweets created if less than 20) and when they were created
if (appRequest === "my-tweets") {
  var client = new twitter(keys.twitterKeys);
  var params = { screen_name: userRequest };
  client.get('statuses/user_timeline', params, function(error, tweets, response) {
    if (!error) {
      // loop to capture if results are less than 20 tweets and prevents error
      for (i = 0; i < tweets.length; i++) {
        console.log("Tweet number: " + (i + 1) + " - Text content: " + tweets[i].text);
        console.log("Created at: " + tweets[i].created_at);
      }
    }
  });
}

// show Title of the movie, Year the movie came out, IMDB Rating of the movie, Rotten Tomatoes Rating of the movie, 
//Country where the movie was produced, Language of the movie, Plot of the movie, Actors in the movie 
// default: Mr. Nobody
if (appRequest === "movie-this") {
  var movieUrl = "http://www.omdbapi.com/?t=" + userRequest + "&y=&plot=short&apikey=" + keys.omdbKey;
  request(movieUrl, function(error, response, body) {
    if (!error && response.statusCode === 200) {
      var requestMovie = JSON.parse(body);
      console.log("Title: " + requestMovie.Title);
      console.log("Year: " + requestMovie.Year);
      console.log("IMDB Rating: " + requestMovie.imdbRating);

      // Checks to see if Rotten Tomato ratings exist in ratings array
      var rotten = requestMovie.Ratings.length;
      var rottenExists = false;
      for (i = 0; i < rotten; i++) {
        if (requestMovie.Ratings[i].Source === "Rotten Tomatoes") {
          console.log("Rotten Tomatoes Rating: " + requestMovie.Ratings[i].Value);
          rottenExists = true;
        }
      }
      if (rottenExists === false) {
        console.log("No Rotten Tomatoes Rating available.");
      }

      console.log("Produced in: " + requestMovie.Country);
      console.log("Language: " + requestMovie.Language);
      console.log("Plot: " + requestMovie.Plot);
      console.log("Actors: " + requestMovie.Actors);
    }
  });
}





// liri.js can take one of the following commands:


// do-what-it-says
// node liri.js do-what-it-says
// take text from random.txt and use it to call one of LIRI's commands - should run spotify 
// change text in random.txt to test other commands

// Bonus
// Output data to both bash window and log.txt
// Append each command to log.txt
// Do not overwrite file