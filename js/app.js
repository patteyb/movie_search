$(document).ready(function() {
    var myMovie = {};
    var movies = {};

    //------------------------------------------------------------------------------------------
    // EVENT LISTENERS
    //------------------------------------------------------------------------------------------
    $('#search').on('change', function () {
        myMovie.s = $(this).val();
        parseString();
    });

    $('#year').on('change', function () {
        myMovie.y = $(this).val();
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
        var url = 'http://www.omdbapi.com/?' + target;
        $.ajax({
        type: 'GET',
        url: url,
        data: { q: 'javascript', format: 'json', pretty: 1 },
        jsonpCallback: 'jsonp',
        dataType: 'jsonp'
        }).then(function (data){
            showMovies(data, url);
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

        $("#total-results").html("Total number of hits in database: " + movies.totalResults);
        
        if (movies.Response === false) {
            html = "<li class='no-movies'><i class='material-icons icon-help'>help_outline</i>No movies found that match: " + title + ".</li>";
        } else {

            for (var i=0; i < movies.Search.length; i++) {
                url = "movie.html?i=" + movies.Search[i].imdbID;
                html += getHTML(movies.Search[i], url);
            }
            $('#movies').html(html);
            
        }
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