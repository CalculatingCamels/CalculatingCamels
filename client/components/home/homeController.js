angular.module('Treadstone.home', [])

.controller('homeController', function ($scope, $location, $http){
	
	$scope.city = "Enter Location"
	//sendData is the method for the ng-submit directive in the html form
	$scope.sendData = function(){
		//searchInput is the ng-model for the input
		console.log("sendData called with", $scope.searchInput);
		$location.path('/search/' + $scope.searchInput); //Default distance for now.
	};

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
	  //Adds styling to the background map
	  var featureOpts = [{"featureType":"all","elementType":"labels","stylers":[{"visibility":"off"}]},{"featureType":"all","elementType":"labels.text.stroke","stylers":[{"visibility":"off"}]},{"featureType":"all","elementType":"labels.icon","stylers":[{"visibility":"off"}]},{"featureType":"administrative","elementType":"geometry.fill","stylers":[{"color":"#000000"},{"lightness":20}]},{"featureType":"administrative","elementType":"geometry.stroke","stylers":[{"color":"#000000"},{"lightness":17},{"weight":1.2}]},{"featureType":"landscape","elementType":"geometry","stylers":[{"color":"#000000"},{"lightness":20}]},{"featureType":"poi","elementType":"geometry","stylers":[{"color":"#000000"},{"lightness":21}]},{"featureType":"road.highway","elementType":"geometry.fill","stylers":[{"color":"#000000"},{"lightness":17}]},{"featureType":"road.highway","elementType":"geometry.stroke","stylers":[{"color":"#000000"},{"lightness":29},{"weight":0.2}]},{"featureType":"road.arterial","elementType":"geometry","stylers":[{"color":"#000000"},{"lightness":18}]},{"featureType":"road.local","elementType":"geometry","stylers":[{"color":"#000000"},{"lightness":16}]},{"featureType":"transit","elementType":"geometry","stylers":[{"color":"#000000"},{"lightness":19}]},{"featureType":"water","elementType":"geometry","stylers":[{"color":"#000000"},{"lightness":17}]}];
	  var mapOptions = {
		zoom: 14,
		center: new google.maps.LatLng(position.coords.latitude, position.coords.longitude),
		scrollwheel: false,
		styles : featureOpts,
		disableDefaultUI : true
	  }
	  var map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
	};//END RENDER MAP


	
	function getCity(position){
		$http({
			method: 'GET',
			url: '//maps.googleapis.com/maps/api/geocode/json?latlng=' + position.coords.latitude + "," + position.coords.longitude
		}).then(function(data){
			var city = data.data.results[4].formatted_address;
			$scope.city = city;
		})
	};

})