angular.module('Treadstone.route', [])

.controller('routeController', function ($scope, $routeParams, $http) {
	var dummyData = {
	   "origin":{
	      "k":30.2703507,
	      "D":-97.7547677
	   },
	   "destination":{
	      "k":30.2818855,
	      "D":-97.7345029
	   },
	   "waypoints":[
	      {
	         "location":{
	            "k":30.2722962,
	            "D":-97.74690470000002
	         },
	         "stopover":false
	      },
	      {
	         "location":{
	            "k":30.2681048,
	            "D":-97.74011100000001
	         },
	         "stopover":false
	      },
	      {
	         "location":{
	            "k":30.263495,
	            "D":-97.73095009999997
	         },
	         "stopover":false
	      },
	      {
	         "location":{
	            "k":30.26484578682241,
	            "D":-97.72196169076386
	         },
	         "stopover":false
	      },
	      {
	         "location":{
	            "k":30.27565349999999,
	            "D":-97.7321986
	         },
	         "stopover":false
	      }
	   ],
	   "travelMode":"BICYCLING",
	   "j":4,
	   "optimizeWaypoints":false,
	   "k":14,
	   "routeName":"undefined",
	   "routeDescription":"undefined"
	}

	var waypoints = [];

	dummyData.waypoints.forEach(function(WP){
		waypoints.push({
			location: "" + WP.location.k + " " + WP.location.D
		})
	})

	console.log(waypoints);

	var directionsDisplay = new google.maps.DirectionsRenderer({draggable: true});
	var directionsService = new google.maps.DirectionsService();

	// var route =

	$http({
		method: 'GET',
		url: '/api/routes/'+ $routeParams.route_id,
	}).then(function(data) {
		renderMap(dummyData.origin, waypoints, dummyData.destination, dummyData.travelMode);
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
