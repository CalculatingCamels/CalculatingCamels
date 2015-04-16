angular.module('Treadstone.addRoute', [])

.controller('addRouteController', function ($scope, $http, geocoderFactory) {

	var directionsDisplay = new google.maps.DirectionsRenderer({draggable: true});
	var directionsService = new google.maps.DirectionsService();
	
	renderMap("Austin, TX");
   
    // for documentation on googlemaps geocoding API and the geocoderFactory, 
    // look in factories.js file.
	$scope.submit = function(){
		geocoderFactory.createGeocoder($scope.location, function(results, status){
			if(status == google.maps.GeocoderStatus.OK){
				$scope.lat = results[0].geometry.location.k
				$scope.lon = results[0].geometry.location.D
				console.log($scope.lat, $scope.lon);
				$scope.center = new google.maps.LatLng($scope.lat, $scope.lon);
				renderMap($scope.location);
			}
		});	
	}

	$scope.saveRoute = function(){
		var obj = directionsDisplay.getMap();
		var dir = directionsDisplay.getDirections();
		console.log('Map: ', obj);
		console.log('Directions: ', dir);
	}

	function renderMap(location){

		var map;

		// var centerPoint = new google.maps.LatLng($scope.lat, $scope.lon);

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
		    origin: location,
		    destination: location,
		    waypoints:[],
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
		
		console.log(directionsDisplay.getDirections());
	}
})

// .directive('mapDirective', function() {

// 	return function($scope) {

// 		var rendererOptions = {
// 		  draggable: true,
// 		};

// 		var directionsDisplay = new google.maps.DirectionsRenderer(rendererOptions);;
// 		var directionsService = new google.maps.DirectionsService();
// 		var map;

// 		// var centerPoint = new google.maps.LatLng($scope.lat, $scope.lon);

// 		  var mapOptions = {
// 		    zoom: 8,
// 		    center: $scope.center,
// 		    disableDefaultUI: false
// 		  };

// 		  map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
// 		  directionsDisplay.setMap(map);
// 		  directionsDisplay.setPanel(document.getElementById('directionsPanel'));

// 		  google.maps.event.addListener(directionsDisplay, 'directions_changed', function() {
// 		    computeTotalDistance(directionsDisplay.getDirections());
// 		  });

// 		  calcRoute();
		

// 		function calcRoute() {
// 		  console.log("cityA", $scope.cityA, "cityB", $scope.cityB);
// 		  var request = {
// 		    origin: 'Austin, TX',
// 		    destination: 'Dallas, TX',
// 		    waypoints:[{location: 'San Antonio, TX'}],
// 		    travelMode: google.maps.TravelMode.BICYCLING
// 		  };
// 		  directionsService.route(request, function(response, status) {
// 		    if (status == google.maps.DirectionsStatus.OK) {
// 		      directionsDisplay.setDirections(response);
// 		    }
// 		  });
// 		}

// 		function computeTotalDistance(result) {
// 		  var total = 0;
// 		  var myroute = result.routes[0];
// 		  for (var i = 0; i < myroute.legs.length; i++) {
// 		    total += myroute.legs[i].distance.value;
// 		  }
// 		  total = total / 1000.0;
// 		  document.getElementById('total').innerHTML = total + ' km';
// 		}
// 	}
// })


