angular.module('Treadstone.addRoute', [])

.controller('addRouteController', function ($scope, $http, geocoderFactory, $location) {

	var directionsDisplay = new google.maps.DirectionsRenderer({draggable: true});
	var directionsService = new google.maps.DirectionsService();

	$scope.shown = false;

    // for documentation on googlemaps geocoding API and the geocoderFactory,
    // look in factories.js file.
	$scope.submit = function(){
		//Geocoder takes an address and turns it into lat and lon.
		geocoderFactory.createGeocoder($scope.location, function(results, status){
			console.log(results)
			if(status == google.maps.GeocoderStatus.OK){
				//Google changes what letters they use to represent Lat and Long every once in a while.
				$scope.lat = results[0].geometry.location.A
				$scope.lon = results[0].geometry.location.F
				$scope.center = new google.maps.LatLng($scope.lat, $scope.lon);
				renderMap($scope.location);
			} else {
				console.log("City not found");
			}
		});
		$scope.shown = true;
	}

	// This function saves the route after the user has dragged the waypoints into their desired position
	// The function is called by clicking saveroute in addRouteView.html
	$scope.saveRoute = function(){
		var dir = directionsDisplay.getDirections();

		dir.request.routeName = "" + $scope.name;
		dir.request.routeDescription = "" + $scope.description;
		dir.request.distance = getTotalDistance(dir);
		console.log("dir.request: ", dir.request);

		//Function checks input and always converts it to a LAT & LON
		function checkOriginInput(originRequest) {
			if( typeof(originRequest) === 'string' ){
				geocoderFactory.createGeocoder(originRequest, function(results, status){
					dir.request.origin = {
						//had to change the GOOGLE LAT LONG TARGETS HERE TOO
						k:results[0].geometry.location.A,
						D:results[0].geometry.location.F
					}
					getCity(dir.request.origin.k, dir.request.origin.D, function(cityState){
						console.log("if: ",dir.request);
						dir.request.cityState = cityState;
						$scope.name = "";
						$scope.description = "";
						$scope.location = "";
						checkDestinationInput(dir.request.destination)
					});

				})
			} else {
				getCity(dir.request.origin.k, dir.request.origin.D, function(cityState){
				console.log("else: ",dir.request)
					dir.request.cityState = cityState;
					$scope.name = "";
					$scope.description = "";
					$scope.location = "";

					//Now check the destination
					checkDestinationInput(dir.request.destination)
				});
			}

		}

		//This will allow the route to be saved if the destination is not moved on the map.
		//Checks the input and always converts it to a LAT and LON
		function checkDestinationInput(destinationRequest){
			if( typeof(destinationRequest) === "string"){
				geocoderFactory.createGeocoder(destinationRequest, function(results, status){
					dir.request.destination = {
						//Changes GOOGLE LAT AND LONG HERE TOO
						k:results[0].geometry.location.A,
						D:results[0].geometry.location.F
					}
					console.log("if: ", dir.request.destination);
					postRoute();
				})
			} else {
				console.log("else: ", dir.request.destination);
				postRoute();
			}
		}

		checkOriginInput(dir.request.origin);

		// http post request to our server to save the route, called by saveRoute
		function postRoute() {
			return $http({
						method: 'POST',
						url: '/api/routes',
						data: dir.request,
						headers: { 'Content-Type': 'application/json' }
					}).then(function(resp) {
						return resp.data;
					})
		}

		$location.path('/');
	}

	function getCity(latitude, longitude, cb){
		$http({
			method: 'GET',
			url: '//maps.googleapis.com/maps/api/geocode/json?latlng=' + latitude + "," + longitude
		}).then(function(data){
			var location = formatCity(data.data.results[1]);
			cb(location);
		})
	}

	function getTotalDistance(result){
			var total =0;
			var myroute = result.routes[0];
		  for (var i = 0; i < myroute.legs.length; i++) {
		    total += myroute.legs[i].distance.value;
		  }
		  total = total / 1000.0;
		  return total;
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
			var total = getTotalDistance(result);
		  document.getElementById('total').innerHTML = total + ' km';
		}
	} //END RENDER MAP

	function formatCity(cityString) {
		var cityState = cityString.formatted_address.split(',').slice(-3);
		var formatCity = cityState[0];
		var formatState = cityState[1].split(' ')[1];
		var location = "" + formatCity + ", " + formatState;
		return location.trim();
	}
})


