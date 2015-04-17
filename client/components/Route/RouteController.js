angular.module('Treadstone.route', [])

.controller('routeController', function ($scope, $routeParams, $http) {

	var directionsDisplay = new google.maps.DirectionsRenderer({draggable: true});
	var directionsService = new google.maps.DirectionsService();

	// var route =

	$http({
		method: 'GET',
		url: '/api/routes/'+ $routeParams.route_id,
	}).then(function(data) {
		renderMap(JSON.parse(data));
	})


	function renderMap(location){

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

		  calcRoute(route);
		

		function calcRoute(route) {
		  var request = {
		    origin: route.origin,
		    destination: route.destination,
		    waypoints: route.waypoints,
		    travelMode: route.traveMode
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
