angular.module('Treadstone.home', [])

.controller('homeController', function ($scope, $location, $http){
	//TODO
	$scope.sendData = function(){
		//DO STUFF WITH INPUT DATA;
		//WHEN CITY IS ENTERED FIND FIND LAT AND LONG ON GOOGLE MAPS
		console.log("sendData called with", $scope.searchInput);
		$location.path('/search/' + $scope.searchInput + '/25'); //Default distance for now.
	}

	//Gets LAT & LON coordinates
	if (navigator.geolocation) {
	  console.log('Geolocation is supported!');
	  navigator.geolocation.getCurrentPosition(function(position){
		$scope.currentPosition = position;
		getCity(position);
	  })
	} else {
	  console.log('Geolocation is not supported on this browser');
	}

	function getCity(position){
		$http({
			method: 'GET',
			url: 'http://maps.googleapis.com/maps/api/geocode/json?latlng=' + position.coords.latitude + "," + position.coords.longitude
		}).then(function(data){
			console.log(data);
		})
	}
});