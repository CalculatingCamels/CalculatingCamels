var express = require('express');
var pg = require('pg');
var bodyParser = require('body-parser');
var helpers = require('../server/helpers.js');
var session = require('express-session')

var app = express();

app.use(bodyParser.json());
app.use(express.static('./client'));

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
    'id integer NOT NULL PRIMARY KEY,' +
    'username varchar(40) NOT NULL,' +
    'password varchar(255) NOT NULL,' +
  ');';
  
  var routes = '';

  connectDB(function(){
    client.query(users, function(err, result){
      if(err) return console.log(err);
      console.log('created table `users`');
    })
  })
};

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

  if(req.session.loggedIn){
    //already logged in
    res.json({'valid': true, 'redirect': req.body.redirect})
  } else {
    if(valid){
      req.session.loggedIn = true;
      res.json({'valid': true, 'redirect': req.body.redirect})
    }
  }
});

//SIGNUP
app.post('/api/signup', function(req, res){

});


app.listen(3000, 'localhost');

console.log('server listening on localhost:3000')