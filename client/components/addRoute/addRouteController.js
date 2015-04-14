angular.module('Treadstone.addRoute', [])

.controller('addRouteController', function ($scope) {
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

	// var rendererOptions = {
	//   draggable: true
	// };

	// var directionsDisplay = new google.maps.DirectionsRenderer(rendererOptions);;
	// var directionsService = new google.maps.DirectionsService();
	// var map;

	// var centerPoint = new google.maps.LatLng(-25.274398, 133.775136);

	// return function initialize() {

	//   var mapOptions = {
	//     zoom: 8,
	//     center: centerPoint
	//   };

	//   map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
	//   directionsDisplay.setMap(map);
	//   directionsDisplay.setPanel(document.getElementById('directionsPanel'));

	//   google.maps.event.addListener(directionsDisplay, 'directions_changed', function() {
	//     computeTotalDistance(directionsDisplay.getDirections());
	//   });

	//   calcRoute();
	// }

	// function calcRoute() {

	//   var request = {
	//     origin: 'Sydney, NSW',
	//     destination: 'Sydney, NSW',
	//     waypoints:[{location: 'Bourke, NSW'}, {location: 'Broken Hill, NSW'}],
	//     travelMode: google.maps.TravelMode.DRIVING
	//   };
	//   directionsService.route(request, function(response, status) {
	//     if (status == google.maps.DirectionsStatus.OK) {
	//       directionsDisplay.setDirections(response);
	//     }
	//   });
	// }

	// function computeTotalDistance(result) {
	//   var total = 0;
	//   var myroute = result.routes[0];
	//   for (var i = 0; i < myroute.legs.length; i++) {
	//     total += myroute.legs[i].distance.value;
	//   }
	//   total = total / 1000.0;
	//   document.getElementById('total').innerHTML = total + ' km';
	// }

	// google.maps.event.addDomListener(window, 'load', initialize);
})


