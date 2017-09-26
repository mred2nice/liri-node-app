//********************************/
// take in command line arguement /
/*********************************/
var input = process.argv[2];
var fs = require("fs");
var textFile = "log.txt";
//****************************************************************/
// switch statement used to determine action item entered by User /
//****************************************************************/
switch (input) {
	case "my-tweets":
		tweets();
		break;
	case "movie-this":
		//**********************************/
		// if no movie passed use Mr.Nobody /
		//**********************************/
	    if (process.argv[3]) {
	    	movie(process.argv[3]);
	    } else {
			movie("Mr Nobody");
		}
		break;
	case "spotify-this-song":
		//***********************************************/
		// if no song passed use The Sign by Ace of Base /
		//***********************************************/
		if (process.argv[3]) {
		    spotify(process.argv[3]);
		} else {
			spotify("The Sign");
		}
		break;
	case "do-what-it-says":
		var fs = require("fs");
		fs.readFile("random.txt", "utf8", function(error, data) {
			if (error) {
				return console.log(error);
			}  
			//***************************************************************************/
			// Split text in file by comma...first is the action second is the selection /
			//***************************************************************************/
			var dataArr = data.split(",");
			var action = dataArr[0].trim();
			var selection = dataArr[1].trim();
			random(action,selection);
		});
		break;
	default:
		console.log("A valid input action has not been entered.")
}

function tweets() {
	var Twit = require('twit');
	/***************************************************************************/
	// load key.js and get twitterkeys(module.exports) into individual variables /
	//***************************************************************************/
	var keys = require("./keys.js");
	var consumerKey = keys.consumer_key;
	var consumerSecret = keys.consumer_secret;
	var accessTokenKey = keys.access_token_key;
	var accessTokenSecret = keys.access_token_secret;
	var T = new Twit({consumer_key: consumerKey,consumer_secret: consumerSecret,access_token: accessTokenKey,
					  access_token_secret: accessTokenSecret});
	var params = {screen_name: 'Jim Hope',count: '20'};
	T.get('statuses/user_timeline', params, function(err,data,response) {
		for (var i=0; i<data.length; i++) {
	  		console.log(data[i].text);
	  		addLog(data[i].text);
	  	}
	});
};

function movie(movie) {
	var request = require("request");
	//********************************************************/
    // run a request to the OMDB API with the movie specified /
    //********************************************************/
	request("http://www.omdbapi.com/?t=" + movie + "&y=&plot=short&tomatoes=true&r=json&apikey=40e9cece", function(error, response, body) {
	//************************************************************************/
	// If the request is successful (i.e. if the response status code is 200) /
	//************************************************************************/
	 if (!error && response.statusCode === 200) {
	 	//*******************************************************/
	    // Parse the body of the site and recover the following: /
	    // 	- Title of the movie.                                /
   		//	- Year the movie came out.                           /
    	//	- IMDB Rating of the movie.                          /
   		//  - Rotten Tomatoes Rating of the movie.               /
   		//  - Country where the movie was produced.              /
   		//	- Language of the movie.                             /
   		//	- Plot of the movie.                                 /
   		//	- Actors in the movie.                               /
	    //*******************************************************/
	    console.log("Title: " + JSON.parse(body).Title);
	    console.log("Year the movie came out: " + JSON.parse(body).Year);
	    console.log("IMDB Rating: " + JSON.parse(body).imdbRating);
	    console.log("Rotten Tomatoes: " + JSON.parse(body).tomatoRating);
	    console.log("Country where movie produced: " + JSON.parse(body).Country);
	    console.log("Language of the movie: " + JSON.parse(body).Language);
	    console.log("Plot of the movie: " + JSON.parse(body).Plot);
	    console.log("Actors in the movie: " + JSON.parse(body).Actors);
	    
	    addLog("Title: " + JSON.parse(body).Title);
	    addLog("Year the movie came out: " + JSON.parse(body).Year);
	    addLog("IMDB Rating: " + JSON.parse(body).imdbRating);
	    addLog("Rotten Tomatoes: " + JSON.parse(body).tomatoRating);
	    addLog("Country where movie produced: " + JSON.parse(body).Country);
	    addLog("Language of the movie: " + JSON.parse(body).Language);
	    addLog("Plot of the movie: " + JSON.parse(body).Plot);
	    addLog("Actors in the movie: " + JSON.parse(body).Actors);
	  }
	});
}

function spotify(song) {
	console.log("song: " + song);
	var Spotify = require('node-spotify-api');
	var spotify = new Spotify({
  		id: "37073a79576741ddaca04d0f9464a92e",
  		secret: "7600c1b1e40a44a4b9fab01292542b75"
	});
	spotify.search({ type: 'track', query: song }, function(err, data) {
	    if (err) {
	        console.log('Error occurred: ' + err);
	        return;  
	    } else {
	    	//*********************************/
			// retrieve song info from Spotify /
			//	- artist                       /
			//	- song name                    /
			//	- album name                   /
			//	- preview url                  /
			//*********************************/
		    var songInfo = data.tracks.items[0];
		    console.log("Artist: " + songInfo.artists[0].name)
		    console.log("Song name: " + songInfo.name)
		    console.log("Album name: " + songInfo.album.name)
		    console.log("Preview URL: " + songInfo.preview_url)

		    addLog("Artist: " + songInfo.artists[0].name)
		    addLog("Song name: " + songInfo.name)
		    addLog("Album name: " + songInfo.album.name)
		    addLog("Preview URL: " + songInfo.preview_url)
	    };
  	});
};

function random(action,selection) {
	switch (action) {
		case "my-tweets":
			tweets(selection);
			break;
		case "movie-this":
		    movie(selection);
			break;
		case "spotify-this-song":
			spotify(selection);
			break;
	}
};

function addLog(value) {
	console.log("addLog: " + value)
	fs.appendFile(textFile, value + '\r\n', function(err) {
  		if (err) { console.log(err); }
	});
};
