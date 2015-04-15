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
  //create and load all schemas here
  var users = 'CREATE TABLE IF NOT EXISTS users (' +
    'id SERIAL NOT NULL PRIMARY KEY,' +
    'username varchar(40) NOT NULL,' +
    'password varchar(255) NOT NULL' +
  ');';

  var cities = 'CREATE TABLE IF NOT EXISTS cities (' +
    'id SERIAL NOT NULL PRIMARY KEY,' +
    'name varchar(80) NOT NULL' +
  ');';
  
  var routes = 'CREATE TABLE IF NOT EXISTS routes (' +
    'id SERIAL NOT NULL PRIMARY KEY,' +
    'username varchar(80) NOT NULL,' +
    'password varchar(255) NOT NULL,' +
    'user_id integer NOT NULL,' +
    'city_id integer NOT NULL' +
  ');';

  connectDB(function(){
    client.query(users + ' ' + routes + ' ' + cities, function(err, result){
      if(err) return console.log(err);
      console.log('created tables');
    });
  })
};

syncTables();

app.get(['/route/add', '/profile'], function(req, res, next){
  if(!req.session.loggedIn) return next();
  res.redirect('/login');
  res.end();
});

//GET INFO ON A SINGLE ROUTE
app.get('/api/routes/:routeid', function(req, res){
  res.status(200).json({'requested_route': req.params.routeid})
});

//ADD A NEW ROUTE
app.post('/api/route/add', function(req, res){
  //req.body.route_name
  //req.body.route_data

  //insert into DB here

  res.status(200).json({'route_id': '1255675645342'})
});

//UPDATE USER INFORMATION
app.post('/api/user/update', function(req, res){
  
});

//SIGNIN
app.post('/api/signin', function(req, res){
  //req.body.username
  //req.body.password
  //req.body.redirect
  console.log(req.body)
  if(req.session.loggedIn){
    //already logged in
    res.json({'valid': true})
  } else {
    client.query('SELECT * FROM users WHERE username = $1 LIMIT 1', [req.body.username], function(err, result){
      console.log(result)
      if(err) return console.log(err);
      if(result.rows.length > 0 && result.rows[0].username === req.body.username && helpers.checkPassword(req.body.password, result.rows[0].password)){
        req.session.loggedIn = true;
        res.status(200).json({'valid': true});
      } else {
        res.status(200).json({'valid': false});
      }
    });
  }
});

//SIGNUP
app.post('/api/signup', function(req, res){
  //check if username is already existing
  //hash password and store it
  client.query('SELECT * FROM users WHERE username = $1 LIMIT 1', [req.body.username], function(err, result){
    if(err) return console.log(err);
    if(result.rows.length > 0){
      client.query('INSERT INTO users (username, password) VALUES (?,?)', [req.body.username, helpers.hashPassword(req.body.password)], function(err, result){
        if(err) return console.log(err);
        req.session.loggedIn = true;
        res.status(200).json({'valid': true});
      });
    } else {
      res.status(200).json({'valid': false})
    }
  });
});


app.listen(3000, 'localhost');

console.log('server listening on localhost:3000')