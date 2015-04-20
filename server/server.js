var express = require('express');
var pg = require('pg');
var bodyParser = require('body-parser');
var helpers = require('../server/helpers.js');

var app = express();

app.use(bodyParser.json());
app.use(express.static('./client'));

//Command line postgres connection (copy entire line with quotes):
/*

'/Applications/pgAdmin3.app/Contents/SharedSupport/psql' --host 'ec2-50-17-207-54.compute-1.amazonaws.com' --port 5432 --username 'bjoadkdzfmmdeo' 'da61ffapcqmlrq' && exit || sleep 5 && exit

*/

var client = new pg.Client({
    user: "bjoadkdzfmmdeo",
    password: "1aGrTjAJmzRC3VduAbJN3nLUwo",
    database: "da61ffapcqmlrq",
    port: 5432,
    host: "ec2-50-17-207-54.compute-1.amazonaws.com",
    ssl: true
});

var connectDB = function(cb){
  client.connect(function(err, client){
    if(err) return console.log(err);
    console.log('connected to postgres db successfully');
    cb();
  });
};

var syncTables = function(){
  var routes = 'CREATE TABLE IF NOT EXISTS routes (' +
    'id SERIAL NOT NULL PRIMARY KEY,' +
    'data text NOT NULL,' +
    'city text NOT NULL' +
  ');';

  connectDB(function(){
    client.query(routes, function(err, result){
      console.log('created table');
    });
  })
};

syncTables();

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
    client.query('SELECT * FROM routes WHERE city = $1', [helpers.formatCity(req.params.picker)], function(err, result){
      if(!result || err) return res.status(200).json([{'error': 'routes not found'}])
      res.status(200).json(result.rows);
    });
  }
});

//ADD A NEW ROUTE
app.post('/api/routes', function(req, res){
  var search = helpers.formatCity(req.body.cityState);
  client.query('INSERT INTO routes (data, city) VALUES ($1,$2) RETURNING id', [JSON.stringify(req.body), search], function(err, result){
    res.status(200).json({'success': true, 'route_id': result.rows[0].id});
  });
});

//DELETE A ROUTE
app.delete('/api/route/:route_id', function(req, res){
  client.query('DELETE FROM routes WHERE id = $1 RETURNING *', [req.params.route_id], function(err, result){
    res.status(200).json({'success': result.rows.length > 0});
  });
});

app.listen(process.env.PORT || 3000);

console.log('server listening on ' + (process.env.PORT || 3000));
