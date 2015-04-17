angular.module('Treadstone.factory', [])
.factory('geocoderFactory', function(){
	var address;
	//addr is going to be a string of human readable address.

	//documentation on google maps geocoding API: 

	//[https://developers.google.com/maps/documentation/geocoding/]
    
    //geocoding is the process of turning a human readable address into
    //latitude and longitude coordinates.
	function createGeocoder(addr, cb){
		address = addr;
		var geocoder = new google.maps.Geocoder();
		geocoder.geocode({'address': addr }, function(results, status){
			cb(results, status);
		})
		
	}
	return {
		address: address,
		createGeocoder: createGeocoder
	}
})
// .factory('mapFactory', function(){
// 	function renderMap(location, anchorDiv, center){
// 		var map;

// 		  var mapOptions = {
// 		    zoom: 15,
// 		    center: center,
// 		    disableDefaultUI: false
// 		  };

// 		  map = new google.maps.Map(document.getElementById(anchorDiv), mapOptions);
// 		  directionsDisplay.setMap(map);
// 		  directionsDisplay.setPanel(document.getElementById('directionsPanel'));

// 		  google.maps.event.addListener(directionsDisplay, 'directions_changed', function() {
// 		    computeTotalDistance(directionsDisplay.getDirections());
// 		  });

// 		  calcRoute();
		

// 		function calcRoute() {
// 		  var request = {
// 		    origin: location,
// 		    destination: location,
// 		    waypoints:[],
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

// 	return {
// 		renderMap: renderMap
// 	}
// })