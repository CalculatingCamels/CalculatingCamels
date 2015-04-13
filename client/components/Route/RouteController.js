angular.module('Treadstone.route', [])

.controller('routeController', function ($scope) {
	console.log("Add route Controller");
})

.directive('googleMaps', function() {
	return function () {
		console.log("Inside google maps directive");
		var mapOptions = {
			zoom: 8,
			center: new google.maps.LatLng(30.28, -97.73)
		}
		var map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
	}
})