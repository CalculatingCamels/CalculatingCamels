angular.module('Treadstone.route', [])

.controller('routeController', function ($scope, $routeParams, $http) {
	// var dummyData = {
 //   "origin":{
 //      "k":41.8781136,
 //      "D":-87.62979819999998
 //   },
 //   "destination":{
 //      "k":41.8963833,
 //      "D":-87.74828079999997
 //   },
 //   "waypoints":[
 //      {
 //         "location":{
 //            "k":41.9053178,
 //            "D":-87.67109440000002
 //         },
 //         "stopover":false
 //      },
 //      {
 //         "location":{
 //            "k":41.8974409,
 //            "D":-87.7029637
 //         },
 //         "stopover":false
 //      },
 //      {
 //         "location":{
 //            "k":41.9035254937501,
 //            "D":-87.71951259090213
 //         },
 //         "stopover":false
 //      }
 //   ],
 //   "travelMode":"BICYCLING",
 //   "j":3,
 //   "optimizeWaypoints":false,
 //   "k":12,
 //   "routeName":"undefined",
 //   "routeDescription":"undefined",
 //   "cityState":{
 //      "ancestorOrigins":{
 //         "length":0
 //      },
 //      "origin":"http://localhost:3000",
 //      "hash":"#/route/add",
 //      "search":"",
 //      "pathname":"/",
 //      "port":"3000",
 //      "hostname":"localhost",
 //      "host":"localhost:3000",
 //      "protocol":"http:",
 //      "href":"http://localhost:3000/#/route/add"
 //   }
// }

  function parseWaypoints(waypoints){
    var wpArray=[]
  	waypoints.forEach(function(WP){
  		wpArray.push({
  			location: "" + WP.location.k + " " + WP.location.D
  		})
  	})
    return wpArray;
  };

	var directionsDisplay = new google.maps.DirectionsRenderer({draggable: true});
	var directionsService = new google.maps.DirectionsService();

	// var route =

	$http({
		method: 'GET',
		url: '/api/routes/'+ $routeParams.route_id,
	}).then(function(data) {
    //yes.... we need three datas.... 
    //because my team is a piece of shit.
    var routeInfo = JSON.parse(data.data.data);

		renderMap(routeInfo.origin, parseWaypoints(routeInfo.waypoints), routeInfo.destination, routeInfo.travelMode);
	})


	function renderMap(origin, waypoints, destination, travelMode){

		var map;

		  var mapOptions = {
		    zoom: 15,
		    center: $scope.center,
		    disableDefaultUI: false
		  };

		  map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
		  directionsDisplay.setMap(map);
		  directionsDisplay.setPanel(document.getElementById('directionsPanel'));

		  google.maps.event.addListener(directionsDisplay, 'directions_changed', function() {
		    computeTotalDistance(directionsDisplay.getDirections());
		  });

		  calcRoute();
		

		function calcRoute() {
		  var request = {
		    origin: "" + origin.k + " " + origin.D,
		    destination: "" + destination.k + " " + destination.D,
		    waypoints: waypoints,
		    travelMode: travelMode
		  };
		  directionsService.route(request, function(response, status) {
		    if (status == google.maps.DirectionsStatus.OK) {
		      directionsDisplay.setDirections(response);
		    }
		  });
		}

		function computeTotalDistance(result) {
		  var total = 0;
		  var myroute = result.routes[0];
		  for (var i = 0; i < myroute.legs.length; i++) {
		    total += myroute.legs[i].distance.value;
		  }
		  total = total / 1000.0;
		  document.getElementById('total').innerHTML = total + ' km';
		}
		
	}
})
