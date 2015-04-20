angular.module('Treadstone.route', [])

.controller('routeController', function ($scope, $routeParams, $http, $location) {
	$scope.route = {};


	$scope.deleteRoute = function(){
		if(confirm("Are you sure you want to delete this route? This will delete the route for everyone.")){			
			$http({
				method: "DELETE",
				url: '/api/route/' + $routeParams.route_id,
			}).then(function(result){
				$location.path('/');
			})
		}
	}

	$scope.hyperlapse = function(){		
		$location.path('/route/hyperlapse/' + $routeParams.route_id);
	}

  function parseWaypoints(waypoints){
    var wpArray=[]
  	waypoints.forEach(function(WP){
  		wpArray.push({
  			location: "" + WP.location.k + " " + WP.location.D
  		})
  	})
    return wpArray;
  };

	var directionsDisplay = new google.maps.DirectionsRenderer({draggable: true});
	var directionsService = new google.maps.DirectionsService();

	$http({
		method: 'GET',
		url: '/api/routes/'+ $routeParams.route_id,
	}).then(function(route) {
    var routeInfo = JSON.parse(route.data.data);
    $scope.route.name = routeInfor.routeName;
    $scope.route.description = routeInfo.routeDescription;
		renderMap(routeInfo.origin, parseWaypoints(routeInfo.waypoints), routeInfo.destination, routeInfo.travelMode);
	})


	function renderMap(origin, waypoints, destination, travelMode){
	  var mapOptions = {
	    zoom: 15,
	    center: $scope.center,
	    disableDefaultUI: false
	  };

	  var map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
	  directionsDisplay.setMap(map);
	  directionsDisplay.setPanel(document.getElementById('directionsPanel'));

	  google.maps.event.addListener(directionsDisplay, 'directions_changed', function() {
	    computeTotalDistance(directionsDisplay.getDirections());
	  });

	  calcRoute();

		function calcRoute() {
		  var request = {
		    origin: "" + origin.k + " " + origin.D,
		    destination: "" + destination.k + " " + destination.D,
		    waypoints: waypoints,
		    travelMode: travelMode
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
