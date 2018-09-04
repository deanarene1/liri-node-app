require("dotenv").config();

const keys = require("./keys.js");
const request = require("request");
const Spotify = require("node-spotify-api");
const Twitter = require("twitter");
const spotify = new Spotify(keys.spotify);
const client = new Twitter(keys.twitter);

var params = { screen_name: 'deanarene1' };

const input = process.argv[2];


switch (input) {
    case 'my-tweets': {
        client.get('statuses/user_timeline', params, function (error, tweets, response) {
            if (!error) {

                for (let i = 0; i < 20 && i < tweets.length; i++) {
                    console.log(tweets[i].created_at);
                    console.log(tweets[i].text);
                }

            }

        });
    }
        break;

    case 'spotify-this-song': {
        let songchoice = [];

        for (i = 3; i < process.argv.length; i++){
            songchoice.push(process.argv[i]);
        }

        if (!process.argv[3]){
            songchoice = ['The Sign Ace'];
        }

        spotify.search({ type: 'track', query: songchoice.join(' '), limit: 1 }, function(err,data) {
            if (err) {
                return console.log(err);
            };
            const track = data.tracks.items[0];
    
            for (let i = 0; i < track.artists.length ; i ++) {
                console.log("Artist name:" + " " + track.artists[i].name);
            }
    
            console.log("Song name:" + " " + track.name);
    
            console.log("Preview URL link:" + " " + track.preview_url);
    
            console.log("Album name:" + " " + track.album.name);
    
        });
    }
        break;

    case 'movie-this': {
        let moviename = [];
        for (i = 3; i < process.argv.length; i++){
            moviename.push(process.argv[i]);
        }

        if (!process.argv[3]){
            moviename = ['Mr. Nobody'];
        }

        const apikey = '&apikey=trilogy';
        const queryURL = 'http://www.omdbapi.com/?t=' + moviename.join(' ') + apikey;
    
        request(queryURL, function (err, resp, body) {
            if (!err && resp.statusCode === 200) {
                let dabody = JSON.parse(body);
                console.log(dabody.Title);
                console.log(dabody.Year);
                console.log(dabody.imdbRating);
    
                for (let i = 0; i < dabody.Ratings.length ; i ++) {
                    if (dabody.Ratings[i].Source === "Rotten Tomatoes"){
                        console.log (dabody.Ratings[i].Value);
                    }
                }
    
                console.log(dabody.Country);
                console.log(dabody.Language);
                console.log(dabody.Plot);
                console.log(dabody.Actors);
            }
    
        });
    }
        break;
}





