$(document).ready(function() {
    
    var myMovie = {};
    var movies = {};

    //------------------------------------------------------------------------------------------
    // EVENT LISTENERS
    //------------------------------------------------------------------------------------------
    $('.search-form').on('submit', function (e) {
        e.preventDefault();
        myMovie.s = $(this.search).val();

        if ($(this.year).val().length !== 0) {
            myMovie.y = $(this.year).val();
        } else {
            myMovie.y = '';
        }
        parseString();
    });

    //-------------------------------------------------------------------------------------------
    // FUNCTION parseString()
    //
    // Create the query string for www.omdbapi.com request
    // Calls getMovie, sending the searchStr as an argument
    //-------------------------------------------------------------------------------------------
    var parseString = function() {
        var searchStr = $.param(myMovie)  + '&plot=short&r=json';
        getMovie(searchStr);
    };

    //-------------------------------------------------------------------------------------------
    // FUNCTION getMovie()
    //
    // Sets up ajax request to www.omdbapi.com, which sends back JSON-formatted data
    // Calls showMovies( data ) to dynamically create html
    //------------------------------------------------------------------------------------------ 
    var getMovie = function(target) {

        // Clear out any previous message
        $('#total-results').html('');

        var url = 'http://www.omdbapi.com/?' + target;
        $.ajax({
            type: 'GET',
            url: url,
            data: { q: 'javascript', format: 'json', pretty: 1 },
            jsonpCallback: 'jsonp',
            dataType: 'jsonp',
            success: function(data) {
                showMovies(data, url);
            },
            error: function( jqXHR, err) {
                var msg = '';
                if (jqXHR.status === 0) {
                    msg = 'Not connected.\n Verify Network.';
                } else if (jqXHR.status === 404) {
                    msg = 'Requested page not found [404]';
                } else if (jqXHR.status === 500) {
                    msg = 'Internal Server Error [505].';
                } else if (err = 'parserror') {
                    msg = 'Requested JSON parse failed.';
                } else if (err = 'timeout') {
                    msg = 'time out error.';
                } else if (err = 'abort') {
                    msg = 'Ajax request aborted.';
                } else {
                    msg = 'Uncaught error\n' + jqXHR.responseText;
                }
                $('#total-results').html(msg);
            },
        });
    };

    //-------------------------------------------------------------------------------------------
    // FUNCTION showMovies()
    //
    // Converts JSON-formatted data into a javascript object. 
    // Iterates over the array of movie objects, calling getHTML() to dynamically create the 
    // html for each movie.
    //------------------------------------------------------------------------------------------
    var showMovies = function(data) {
        var html = '';
        var url = '';
        movies = JSON.stringify(data);
        movies = JSON.parse(movies);
        
        if (movies.Response === 'False') {  // No movies returned
            html = "<li class='no-movies'><i class='material-icons icon-help'>help_outline</i>No movies found that match title = '" + myMovie.s + "'";
            if (myMovie.y.length !== 0) {
                html += " and year = '" + myMovie.y + "'";
            }
            html += "</li>";
        } else {                            // Movies returned
            $("#total-results").html("Total number of hits in database: " + movies.totalResults);
            for (var i=0; i < movies.Search.length; i++) {
                url = "movie.html?i=" + movies.Search[i].imdbID;
                html += getHTML(movies.Search[i], url);
            }
        }
        $('#movies').html(html);
    };

    //-------------------------------------------------------------------------------------------
    // FUNCTION getHTML()
    //
    // Sets up the html for individual movies from the array of movies
    // Returns html
    //------------------------------------------------------------------------------------------
    var getHTML = function(movie, url) {
        
        html = "<li><div class='poster-wrap'>";

        if (movie.Poster === 'N/A') {
            html += "<i class='material-icons poster-placeholder'>crop_original</i>";
        } else {
            html += "<a target='_blank' href='" + url + "'><img class='movie-poster' src='" + movie.Poster + "'></a>";
        }
        html += "</div><span class='movie-title'>" + movie.Title + "</span>";
        html += "<span class='movie-year'>" + movie.Year + "</span></li>";    
        return html;
    };

});