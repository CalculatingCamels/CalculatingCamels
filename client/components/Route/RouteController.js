angular.module('Treadstone.route', [])

.controller('routeController', function ($scope, $routeParams, $http, $location) {
	$scope.route = {};
	$scope.elevationClicked = false;
	$scope.elevationCount = 0;

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

///ELEVATION CODE
	$scope.getElevation= function(){
		$scope.elevationClicked = !($scope.elevationClicked);
		$scope.elevationCount+=1;
			var req = $scope.route.path;
			var path = [];

			// google.load('visualization', '1.0', {'packages':['columnchart']});
			var elev = new google.maps.ElevationService();

			//creates the path
			path.push(new google.maps.LatLng(req.origin.k,req.origin.D))
	 		req.waypoints.forEach(function(wp){
	 			path.push(new google.maps.LatLng(wp.location.k , wp.location.D))
	 		});
	 		path.push(new google.maps.LatLng(req.destination.k, req.destination.D));

	    var pathRequest = {
		    'path': path,
		    'samples': 256
	    }   

	    elev.getElevationAlongPath(pathRequest, plotElevation);

	    function plotElevation(results, status){
	    	if(status != google.maps.ElevationStatus.OK){
	    		return;
	    	}
	    	var data = new google.visualization.DataTable();
	    	var elevations = results;
    	  data.addColumn('string', 'Sample');
    	  data.addColumn('number', 'Elevation');
    	  for (var i = 0; i < results.length; i++) {
    	    data.addRow(['', elevations[i].elevation]);
    	  }

    	  // Draw the chart using the data within its DIV.
    	  document.getElementById('elevation_chart').style.display = 'block';
    	  chart = new google.visualization.ColumnChart(document.getElementById('elevation_chart'));

    	  chart.draw(data, {
    	    height: 150,
    	    legend: 'none',
    	    titleY: 'Elevation (m)'
    	  });
      }
	}// end getElevation

	//END ELEVATION CODE


  //Helper function to parse, waypoints from the database. 
  // The maps api wants each lat an lon inside an object literal with a location property.

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

	//Fetches map data from the server for the URL route_id parameter.
	$http({
		method: 'GET',
		url: '/api/routes/'+ $routeParams.route_id,
	}).then(function(route) {

    var routeInfo = JSON.parse(route.data.data);
    console.log(routeInfo)
    //path is the entire route object returned from server. 
    $scope.route.path= routeInfo
    $scope.route.name = routeInfo.routeName;
    $scope.route.description = routeInfo.routeDescription;
		renderMap(routeInfo.origin, parseWaypoints(routeInfo.waypoints), routeInfo.destination, routeInfo.travelMode);
	})


	function renderMap(origin, waypoints, destination, travelMode){
	  var mapOptions = {
	    zoom: 15,
	    center: $scope.center,
	    disableDefaultUI: true
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
