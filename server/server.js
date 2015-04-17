var express = require('express');
var pg = require('pg');
var bodyParser = require('body-parser');
var helpers = require('../server/helpers.js');
var session = require('express-session')

var app = express();

app.use(bodyParser.json());
app.use(express.static('./client'));

//CMD:
//'/Applications/pgAdmin3.app/Contents/SharedSupport/psql' --host 'ec2-50-17-207-54.compute-1.amazonaws.com' --port 5432 --username 'bjoadkdzfmmdeo' 'da61ffapcqmlrq' && exit || sleep 5 && exit
var client = new pg.Client({
    user: "bjoadkdzfmmdeo",
    password: "1aGrTjAJmzRC3VduAbJN3nLUwo",
    database: "da61ffapcqmlrq",
    port: 5432,
    host: "ec2-50-17-207-54.compute-1.amazonaws.com",
    ssl: true
});

app.use(session({
  secret: 'calculatingcamels',
  resave: false,
  saveUninitialized: true
}));

var connectDB = function(cb){
  client.connect(function(err, client){
    if(err) return console.log(err);
    console.log('connected to postgres remote server successfully');
    cb();
  });
};

var syncTables = function(){
  //create and load all tables here

  var dropTables = 'DROP TABLE IF EXISTS users;' + 
  'DROP TABLE IF EXISTS cities;' + 
  'DROP TABLE IF EXISTS routes;';

  var users = 'CREATE TABLE IF NOT EXISTS users (' +
    'id SERIAL NOT NULL PRIMARY KEY,' +
    'username varchar(40) NOT NULL,' +
    'password varchar(255) NOT NULL' +
  ');';

  var cities = 'CREATE TABLE IF NOT EXISTS cities (' +
    'id SERIAL NOT NULL PRIMARY KEY,' +
    'name varchar(80) NOT NULL,' +
    'display_name varchar(80) NOT NULL' +
  ');';
  
  var routes = 'CREATE TABLE IF NOT EXISTS routes (' +
    'id SERIAL NOT NULL PRIMARY KEY,' +
    'user_id varchar(80) NOT NULL,' +
    'data text NOT NULL,' +
    'city_id integer NOT NULL' +
  ');';

  var insertCity = "INSERT INTO cities (name, display_name) VALUES ('austin,tx', 'Austin, TX');";

  var insertRoute = "INSERT INTO routes (user_id, data, city_id) VALUES (1, '{some json route data here}', 1);";

  connectDB(function(){
    client.query(dropTables + ' ' + users + ' ' + routes + ' ' + cities + ' ' + insertCity + ' ' + insertRoute, function(err, result){
      if(err) return console.log(err);
      console.log('dropped and recreated tables');
    });
  })
};

syncTables();

//This won't work yet due to Angular using hashes. In other words, the server is never called when a view changes.
//TODO: Figure out how to restrict access to these pages in Angular.
// app.get(['/route/add', '/profile'], function(req, res, next){
//   if(req.session.loggedIn) return next();
//   res.redirect('/login');
//   res.end();
// });

//GET ROUTE(S)
//EXAMPLES:
  ///api/routes/23
  ///api/routes/austin,tx
  ///api/routes/Chicago,%20IL
app.get('/api/routes/:picker', function(req, res){
  //Assume that both route IDs and cities will be sent to this handler.
  if(!req.params.picker || 1 > req.params.picker.length) return res.status(200).json({'error': 'Please include a route id or city in the url data'})
  if(helpers.isNumeric(req.params.picker)){
    //A number was passed in the url. This signifies that a route id has been passed.
    client.query('SELECT * FROM routes WHERE id = $1 LIMIT 1', [req.params.picker], function(err, result){
      if(result && result.rows.length === 1){
        res.status(200).json(result.rows[0]);
      } else {
        res.status(200).json({'error': 'route not found'});
      }
    });
  } else {
    //1) Check if we support the city.
    //2) If we support the city, grab the 'city_id' and then grab all routes with that city_id.
    //TODO: Build in pagination (start/stop indexes)
    var formattedCity = helpers.formatCity(req.params.picker);
    client.query('SELECT * FROM cities WHERE name = $1', [formattedCity], function(err, result){
      if(result && result.rows.length > 0){
        console.log('grabbing all routes where city_id === ', result.rows[0].id)
        client.query('SELECT * FROM routes WHERE city_id = $1', [result.rows[0].id], function(err, result){
          res.status(200).json(result.rows);
        });
      } else {
        res.status(200).json({'error': 'city not supported'});
      }
    });
  }
});

//ADD A NEW ROUTE
app.post('/api/routes', function(req, res){
  //1) Check if the city the route is in is supported.
  //2) If the city is valid, grab the city_id.
  //3) Stringify input data and insert the route into the DB. Return the route's ID after a successful insertion.
  if(!req.session || !req.session.loggedIn) return res.status(401).json('error': 'unauthorized call');
  var formattedCity = helpers.formatCity(req.body.cityState);
  client.query('SELECT * FROM cities WHERE name = $1', [formattedCity], function(err, result){
    if(result && result.rows.length > 0){
      //The city this user is trying to add a route for is supported
      client.query('INSERT INTO routes (user_id, data, city_id) VALUES ($1,$2,$3) RETURNING id', [req.session.user_id, JSON.stringify(req.body), result.rows[0].id], function(err, result){
        res.status(200).json({'success': true, 'route_id': result.rows[0].id});
      });
    } else {
      res.status(200).json({'error': 'city not supported'});
    }
  });
});

//SIGNIN
app.post('/api/signin', function(req, res){
  //If the user is already logged in:
  if(req.session.loggedIn){
    res.json({'valid': true})
  } else {
    //Pull user's information from the database.
    client.query('SELECT * FROM users WHERE username = $1 LIMIT 1', [req.body.username], function(err, result){
      if(result && result.rows.length > 0 && result.rows[0].username === req.body.username && helpers.checkPassword(req.body.password, result.rows[0].password)){
        req.session.loggedIn = true;
        req.session.username = req.body.username;
        req.session.user_id = result.rows[0].id;
        res.status(200).json({'valid': true});
      } else {
        res.status(200).json({'valid': false});
      }
    });
  }
});

//SIGNUP
app.post('/api/signup', function(req, res){
  //Query the database for the desired username.
  client.query('SELECT * FROM users WHERE username = $1 LIMIT 1', [req.body.username], function(err, result){
    //If there are no rows with this username:
    if(result && result.rows.length === 0){
      client.query('INSERT INTO users (username, password) VALUES ($1,$2) RETURNING id', [req.body.username, helpers.hashPassword(req.body.password)], function(err, result){
        req.session.loggedIn = true;
        req.session.username = req.body.username;
        req.session.user_id = result.rows[0].id;
        res.status(200).json({'valid': true});
      });
    } else {
      res.status(200).json({'valid': false})
    }
  });
});

//SIGNOUT
app.get('/signout', function(req,res){
  req.session.destroy();
  res.redirect('/');
  res.end();
});


app.listen(3000, 'localhost');

console.log('server listening on localhost:3000')