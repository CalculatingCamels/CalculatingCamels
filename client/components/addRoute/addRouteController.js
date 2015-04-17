angular.module('Treadstone.addRoute', [])

.controller('addRouteController', function ($scope, $http, geocoderFactory) {

	var directionsDisplay = new google.maps.DirectionsRenderer({draggable: true});
	var directionsService = new google.maps.DirectionsService();

	$scope.shown = false;
	
	//TODO This needs to be removed in the future;
	// renderMap("Austin, TX");
   
    // for documentation on googlemaps geocoding API and the geocoderFactory, 
    // look in factories.js file.
	$scope.submit = function(){
		//Geocoder takes an address and turns it into lat and lon.
		geocoderFactory.createGeocoder($scope.location, function(results, status){
			if(status == google.maps.GeocoderStatus.OK){
				$scope.lat = results[0].geometry.location.k
				$scope.lon = results[0].geometry.location.D
				$scope.center = new google.maps.LatLng($scope.lat, $scope.lon);
				renderMap($scope.location);
			}
		});
		
		$scope.shown = true;	
	}

	$scope.saveRoute = function(){
		var position = {coords:{}};
		var dir = directionsDisplay.getDirections();
		if(typeof $scope.location === "string"){
			geocoderFactory.createGeocoder($scope.location, function(results, status){		
				dir.request.origin = {
					k: results[0].geometry.location.k,
					D: results[0].geometry.location.D
				}
				postRoute();
			});
		} else {
			position = {coords: {latitude: dir.request.origin.k, longitude: dir.request.origin.D}}
			getCity(position, function(cityState) {
				dir.request.cityState = cityState;
			});
			
			dir.request.routeName = "" + $scope.name;
			dir.request.routeDescription = "" + $scope.description;

			postRoute();
			
		}
		

		function postRoute() {
			return $http({
						method: 'POST',
						url: '/api/routes',
						data: {'request': dir.request},
						headers: { 'Content-Type': 'application/json' }
					}).then(function(resp) {
						return resp.data;
					})
		} 
			

		$scope.name = "";
		$scope.description = "";
		$scope.location = "";
	}

	function getCity(position, cb){
		$http({
			method: 'GET',
			url: 'http://maps.googleapis.com/maps/api/geocode/json?latlng=' + position.coords.latitude + "," + position.coords.longitude
		}).then(function(data){
			// var location = formatCity(data.data.results[1]);
			cb(location);
		})
	}

	function renderMap(location){

		var map;

		  var mapOptions = {
		    zoom: 12,
		    center: $scope.center,
		    scrollwheel: false,
		    // disableDefaultUI: false
		  };

		  map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);

		  directionsDisplay.setOptions({preserveViewport : true})
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
	} //END RENDER MAP
	
	function formatCity(cityString) {
		var cityState = cityString.formatted_address.split(',').slice(-3);
		var formatCity = cityState[0];
		var formatState = cityState[1].split(' ')[1];
		var location = "" + formatCity + ", " + formatState;
		return location;
	}
})


