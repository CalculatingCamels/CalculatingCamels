angular.module('Treadstone.home', [])

.controller('homeController', function ($scope, $location, $http){
	
	$scope.city = "Enter Location"
	//sendData is the method for the ng-submit directive in the html form
	$scope.sendData = function(){
		//searchInput is the ng-model for the input
		console.log("sendData called with", $scope.searchInput);
		$location.path('/search/' + $scope.searchInput + '/25'); //Default distance for now.
	}

	//Gets LAT & LON coordinates
	//"navigator.geolocation" is a read only property that returns a geolocation object.
	// getCurrentPosition is a method on the geolocation object that takes a callback
	// function with one argument (position) and returns the instance of the geolocation object, named position.   
	if (navigator.geolocation) {
	  console.log('Geolocation is supported!');
	  navigator.geolocation.getCurrentPosition(function(position){
		$scope.currentPosition = position;
		getCity(position);
		$scope.renderMap(position);
	  })
	} else {
		// We should have a default image if the map won't load
	  console.log('Geolocation is not supported on this browser');
	}

    // the position instance has "coords" object on it with latitude and longitude properties. 
    // getCity queries googlemaps api with the lat/lon coordinates. googlemaps api returns a response
    // with a data array. results[5] from the array returns the city.   

	$scope.renderMap = function(position){
		console.log("Map rendering");
		var mapOptions = {
			zoom: 14,
			center: new google.maps.LatLng(position.coords.latitude, position.coords.longitude),
			disableDefaultUI: true
		}
		var map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
	}
	
	function getCity(position){
		$http({
			method: 'GET',
			url: 'http://maps.googleapis.com/maps/api/geocode/json?latlng=' + position.coords.latitude + "," + position.coords.longitude
		}).then(function(data){
			var city = data.data.results[5].formatted_address;
			$scope.city = city;
		})
	}
})