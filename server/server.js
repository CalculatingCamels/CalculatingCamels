var express = require('express');
var pg = require('pg');
var bodyParser = require('body-parser');

var app = express();

app.use(bodyParser.json());
app.use(express.static('../client'));

var client = new pg.Client({
    user: "bjoadkdzfmmdeo",
    password: "1aGrTjAJmzRC3VduAbJN3nLUwo",
    database: "da61ffapcqmlrq",
    port: 5432,
    host: "ec2-50-17-207-54.compute-1.amazonaws.com",
    ssl: true
});

client.connect(function(err, client){
	if(err) return console.log(err);

	console.log('connected to postgres remote server successfully')
});

app.listen(3000, 'localhost');

console.log('server listening on localhost:3000')