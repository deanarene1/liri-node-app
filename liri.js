require("dotenv").config();

const keys = require("./keys.js");
const request = require("request");
const Spotify = require("node-spotify-api");
const Twitter = require("twitter");
const spotify = new Spotify(keys.spotify);
const client = new Twitter(keys.twitter);
const fs = require("fs");

var params = { screen_name: 'deanarene1' };

const input = process.argv[2];

//input resembles process.argv
function moviethis(input) {

    let moviename = [];
    for (i = 3; i < input.length; i++) {
        moviename.push(input[i]);
    }

    if (!input[3]) {
        moviename = ['Mr. Nobody'];
    }

    const apikey = '&apikey=trilogy';
    const queryURL = 'http://www.omdbapi.com/?t=' + moviename.join(' ') + apikey;

    request(queryURL, function (err, resp, body) {
        if (!err && resp.statusCode === 200) {
            let dabody = JSON.parse(body);
            console.log("Movie name:" + " " + dabody.Title);
            console.log("Movie release date:" + " " + dabody.Year);
            console.log("imdb Rating:" + " " + dabody.imdbRating);

            for (let i = 0; i < dabody.Ratings.length; i++) {
                if (dabody.Ratings[i].Source === "Rotten Tomatoes") {
                    console.log("Rotten Tomatoes Rating:" + " " + dabody.Ratings[i].Value);
                }
            }

            console.log("Country:" + " " + dabody.Country);
            console.log("Language:" + " " + dabody.Language);
            console.log("Movie Plot:" + " " + dabody.Plot);
            console.log("Actors:" + " " + dabody.Actors);
        }

    });
};

function mytweets() {
    client.get('statuses/user_timeline', params, function (error, tweets, response) {
        if (!error) {

            for (let i = 0; i < 20 && i < tweets.length; i++) {
                console.log(tweets[i].created_at);
                console.log(tweets[i].text);
            }

        }

    });
}

function spotifysearch(input) {
    let songchoice = [];

    for (i = 3; i < input.length; i++) {
        songchoice.push(input[i]);
    }

    if (!input[3]) {
        songchoice = ['The Sign Ace'];
    }

    spotify.search({ type: 'track', query: songchoice.join(' '), limit: 1 }, function (err, data) {
        if (err) {
            return console.log(err);
        };
        const track = data.tracks.items[0];

        for (let i = 0; i < track.artists.length; i++) {
            console.log("Artist name:" + " " + track.artists[i].name);
        }

        console.log("Song name:" + " " + track.name);

        console.log("Preview URL link:" + " " + track.preview_url);

        console.log("Album name:" + " " + track.album.name);
    });
}


switch (input) {
    case 'my-tweets': {
        mytweets();
    }
        break;

    case 'spotify-this-song': {
        spotifysearch(process.argv);
    }
        break;

    case 'movie-this': {
        moviethis(process.argv);
    }
        break;

    case 'do-what-it-says': {
        let filetext = [" ", " "];


        fs.readFile('random.txt', 'utf8', (err, data) => {
            if (err) {
                console.log(err);
            }

            filetext = filetext.concat(data.split(','));

            switch (filetext[2]) {
                case 'my-tweets': {
                    mytweets();
                }
                    break;

                case 'spotify-this-song': {
                    spotifysearch(filetext);
                }
                    break;

                case 'movie-this': {
                    moviethis(filetext);
                }
                    break;

            }

        })


    }
        break;
}





