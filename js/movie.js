
$(document).ready(function() {

    // Retrieves the IMDb ID from the URL and creates a query string for omdbapi.com
    var imdbID = window.location.search.replace(/^.*?/, '') + '&plot=full&tomatoes=true&r=json';

    //-------------------------------------------------------------------------------------------
    // FUNCTION showMovie()
    //
    // dynamically creates the html from the JSON-formatted argument, data.
    // Loads this html on the page, movie.html
    //-------------------------------------------------------------------------------------------
    var showMovie = function (data) {
        var html = '';

        // Convert the JSON data to a javascript object
        movie = JSON.stringify(data);
        movie = JSON.parse(movie);

        // If no movie was found, 
        if (movie.Response === false) {     // If no movie was found 
            html = "<div class='no-movies'><i class='material-icons icon-help'>help_outline</i>Oh, snap! Something went wrong and we can't find the technician who can fix the problem.</div>";
        } else {                            // movie was found, set up html
            $('.is-hidden').css("opacity", "0");
            html = '<h1>' + movie.Title + ' (' + movie.Year + ')</h1><span class="rating"> IMDb rating: ' + movie.imdbRating + '</span>';
            
            if (movie.tomatoRating !== '') {
                html += '<span class="rating"> Rotten Tomatoes rating: ' + movie.tomatoRating + '</span>';
            }
            $('.movie-title-block').html(html);
            $('#poster-block').html('<img src="' + movie.Poster + '">');
            $('#synopsis').html(movie.Plot);
            $('#actors').html('<strong>Principal actors:</strong> ' + movie.Actors);
            if (movie.Awards !== '') {
                $('#awards').html('<strong>Awards:</strong> ' + movie.Awards);
            }
            $('#buttons').html('<a class="myButton" href="http://imdb.com/title/' + movie.imdbID + '" target="_blank">View on IMDb</a>');
        }
    };

    //-------------------------------------------------------------------------------------------
    // FUNCTION getMovie()
    //
    // Retrieves a record from www.omdbapi.com based on a movie ID.
    // Calls showMovie() to post the information to the web page.
    //-------------------------------------------------------------------------------------------
    var getMovie = function(target) {
        var url = 'http://www.omdbapi.com/' + target;
        console.log(url);
        $.ajax({
        type: 'GET',
        url: url,
        data: { q: 'javascript', format: 'json', pretty: 1 },
        jsonpCallback: 'jsonp',
        dataType: 'jsonp'
        }).then(function (data){
                showMovie(data);
        });
    };

    getMovie(imdbID, 'movie');

});