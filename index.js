var inquirer = require("inquirer");

require("dotenv").config();

var keys = require("./keys");

var Spotify = require('node-spotify-api');

var fs = require("fs");

var spotify = new Spotify(keys.spotify);


var request = require("request");

var omdb = require('omdb');







inquirer.prompt([{
  type: "list",
  name: "doWhat",
  message: "Please select an option...",
  choices: ["spotify-this-song", "movie-this", "do-what-it-says"]
},

{
  type: "input",
  name: "songInput",
  message: "Which song would you like to search?",

  when: function (answers) {
    return answers.doWhat === "spotify-this-song";

  }

},

{
  type: "input",
  name: "movieInput",
  message: "Which movie would you like to search?",
  when: function (answers) {
    return answers.doWhat === "movie-this";
  }
},

{
  type: "confirm",
  name: "otherInput",
  message: "Feeling lucky??",
  when: function (answers) {
    return answers.doWhat === "do-what-it-says";
  }
}


]).then(function (user) {


  switch (user.doWhat) {

    case "spotify-this-song":
      spotifyMe(user.songInput);
      break;

    case "movie-this":
      movieThis(user.movieInput);
      break;

    case "do-what-it-says":
      doWhatItSays();
      break;
  }
});



spotify
  .request('https://api.spotify.com/v1/tracks/7yCPwWs66K8Ba5lFuU2bcx')
  .then(function (data) {
    console.log("Good to go!");
  })
  .catch(function (err) {
    console.error('Error occurred: ' + err);
  });





function spotifyMe(searchTrack) {

  if (!searchTrack) {

    searchTrack = "Creed";

    console.log("I couldn't hear you? You asked for " + searchTrack + "?");
  }
  else {

    spotify.search({ type: 'track', query: searchTrack }, function (err, data) {
      if (err) {
        return console.log('Error occurred: ' + err);
      }

      console.log('****************************')

      console.log("\nArtist: " + data.tracks.items[0].artists[0].name);
      console.log("\nSong name: " + data.tracks.items[0].name);
      console.log("\nPreview Link: " + data.tracks.items[0].preview_url);
      console.log("\nAlbum: " + data.tracks.items[0].album.name);



    });
  }

}



function movieThis(searchMovie) {

  if (!searchMovie) {
    console.log("Say goodnight, ya filthy animal!")
  } else {

    var queryUrl = "http://www.omdbapi.com/?t=" + searchMovie + "&y=&plot=short&apikey=trilogy";

    request(queryUrl, function (error, response, body) {
      if (!error && response.statusCode === 200) {
        var title = JSON.parse(body).Title;
        var year = JSON.parse(body).Year;
        var lang = JSON.parse(body).Language;
        var country = JSON.parse(body).Country;
        var plot = JSON.parse(body).Plot;
        var actors = JSON.parse(body).Actors;
        var imdb = JSON.parse(body).Ratings[0].Value;
        console.log(`\nTitle: ${title}`);
        console.log(`\nYear: ${year}`);
        console.log(`\nIMDB Rating: ${imdb}`);
        console.log(`\nCounrty: ${country}`);
        console.log(`\nLanguage: ${lang}`);
        console.log(`\nPlot: ${plot}`);
        console.log(`\nActors: ${actors}`);

      }
    })

  }
}


var doWhatItSays = function () {
  fs.readFile("random.txt", "utf8", function (error, data) {

    if (error) {
      return console.log('Error occurred: ' + error);
    }
    else {
      console.log(data);
    }

  });
};
