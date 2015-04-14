angular.module('Treadstone.addRoute', [])

.controller('addRouteController', function ($scope) {
	console.log("Added a route Controller");
})

.factory('addRouteFactory', function() {

})

.directive('mapDirective', function() {

	return function () {

		var rendererOptions = {
		  draggable: true,
		};

		var directionsDisplay = new google.maps.DirectionsRenderer(rendererOptions);;
		var directionsService = new google.maps.DirectionsService();
		var map;

		var centerPoint = new google.maps.LatLng(30.30, -97.75);

		// function initialize() {

		  var mapOptions = {
		    zoom: 12,
		    center: centerPoint,
		    disableDefaultUI: true
		  };

		  map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
		  directionsDisplay.setMap(map);
		  directionsDisplay.setPanel(document.getElementById('directionsPanel'));

		  google.maps.event.addListener(directionsDisplay, 'directions_changed', function() {
		    computeTotalDistance(directionsDisplay.getDirections());
		  });

		  calcRoute();
		// }

		function calcRoute() {

		  var request = {
		    origin: 'Austin, TX',
		    destination: 'Austin, TX',
		    waypoints:[{location: 'San Antonio, TX'}],
		    travelMode: google.maps.TravelMode.BICYCLING
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


