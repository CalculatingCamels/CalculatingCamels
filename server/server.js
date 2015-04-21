var express = require('express');
var pg = require('pg');
var bodyParser = require('body-parser');
var helpers = require('../server/helpers.js');

//Yes, we're using express.
var app = express();

//Set up body parser middleware. This middleware automatically formats incoming request data as JSON objects.
app.use(bodyParser.json());

//Serve up static client-side content.
app.use(express.static('./client'));

//Command line postgres connection (copy entire line with quotes). You can use this for managing the database from the command line.
//NOTE: You must use either psql (comes with Postgres) or pgAdmin. Change these settings as necessary.
/*

'/Applications/pgAdmin3.app/Contents/SharedSupport/psql' --host 'ec2-50-17-207-54.compute-1.amazonaws.com' --port 5432 --username 'bjoadkdzfmmdeo' 'da61ffapcqmlrq' && exit || sleep 5 && exit

*/

//Set up postgres client.
var client = new pg.Client({
    user: "bjoadkdzfmmdeo",
    password: "1aGrTjAJmzRC3VduAbJN3nLUwo",
    database: "da61ffapcqmlrq",
    port: 5432,
    host: "ec2-50-17-207-54.compute-1.amazonaws.com",
    ssl: true
});

//This function connects to the database and logs a successful connection.
var connectDB = function(cb){
  client.connect(function(err, client){
    console.log('connected to postgres db successfully');
    cb();
  });
};

//This function creates the necessary tables in the database (if they don't exist) and connects to the database.
var syncTables = function(){

  //Each route has an ID, data and city property (column).
  //id: A unique primary key that is used to reference the route in the app.
  //data: A json string of route data consumed by Google Maps.
  //city: A string of a city with this exact format: austin,tx (no spaces, all lowercase)
  var routes = 'CREATE TABLE IF NOT EXISTS routes (' +
    'id SERIAL NOT NULL PRIMARY KEY,' +
    'data text NOT NULL,' +
    'city text NOT NULL' +
  ');';

  connectDB(function(){
    client.query(routes, function(err, result){
      console.log('created tables');
    });
  })
};

//Run this immediately so the database connection is open for all API calls.
syncTables();


//GET ROUTE(S): An endpoint that returns information on either a single route or all routes in a city.
app.get('/api/routes/:picker', function(req, res){
  //Assume that both route IDs and cities will be sent to this handler.
  if(!req.params.picker || 1 > req.params.picker.length) return res.status(200).json({'error': 'Please include a route id or city in the url data'})
  if(helpers.isNumeric(req.params.picker)){
    //A number was passed in the url. This means that a route ID has been passed.
    client.query('SELECT * FROM routes WHERE id = $1 LIMIT 1', [req.params.picker], function(err, result){
      if(result && result.rows.length === 1){
        res.status(200).json(result.rows[0]);
      } else {
        res.status(200).json({'error': 'route not found'});
      }
    });
  } else {
    //A city string was passed in the URL.
    client.query('SELECT * FROM routes WHERE city = $1', [helpers.formatCity(req.params.picker)], function(err, result){
      if(result && result.rows.length > 0){
        res.status(200).json(result.rows);
      } else {
        res.status(200).json([{'error': 'routes not found'}])
      }
    });
  }
});

//ADD A NEW ROUTE: An endpoint that allows a POST request to add a new route to the database.
app.post('/api/routes', function(req, res){
  client.query('INSERT INTO routes (data, city) VALUES ($1,$2) RETURNING id', [JSON.stringify(req.body), helpers.formatCity(req.body.cityState)], function(err, result){
    res.status(200).json({'success': true, 'route_id': result.rows[0].id});
  });
});

//DELETE A ROUTE: An endpoint that allows a DELETE request to delete a route from the database.
app.delete('/api/route/:route_id', function(req, res){
  client.query('DELETE FROM routes WHERE id = $1 RETURNING *', [req.params.route_id], function(err, result){
    //Return true if there was more than 0 rows removed.
    res.status(200).json({'success': result.rows.length > 0});
  });
});

//process.env.PORT is set by Heroku on deployment. Port 3000 for development, 80 for HTTP and 443 for HTTPS.
app.listen(process.env.PORT || 3000);

console.log('server listening on ' + (process.env.PORT || 3000));
