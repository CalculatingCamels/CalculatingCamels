angular.module('Treadstone.hyperlapse', [])
.controller('hyperlapseController', function ($scope, $routeParams, $http){
  $http({
    method: 'GET',
    url: '/api/routes/'+ $routeParams.route_id,
  }).then(function(route) {
    var routeInfo = JSON.parse(route.data.data);

    console.log('got route info', routeInfo)

    var hyperlapse = new Hyperlapse(document.getElementById('pano'), {
      lookat: new google.maps.LatLng(37.81409525128964,-122.4775045005249),
      zoom: 1,
      use_lookat: false,
      elevation: 10
    });

    hyperlapse.onError = function(e) {
      console.log(e);
    };

    hyperlapse.onRouteComplete = function(e) {
      console.log('onRouteComplete');
      hyperlapse.load();
    };

    hyperlapse.onLoadComplete = function(e) {
      console.log('onLoadComplete');
      hyperlapse.play();
    };

    hyperlapse.onPlayComplete = function(){
      console.log('loop completed')
    }

    hyperlapse.onLoadProgress = function(e){
      console.log(e);
    };

    hyperlapse.onRouteProgress = function(e){
      console.log(e);
    };

    hyperlapse.onFrame = function(e){
      console.log('onframe', e)
    };

    hyperlapse.onPause = function(e){
      console.log('paused');
    }

    // Google Maps API stuff here...
    var directions_service = new google.maps.DirectionsService();

    var route = {
      request:{
        origin: new google.maps.LatLng(routeInfo.origin.k, routeInfo.origin.D),
        destination: new google.maps.LatLng(routeInfo.destination.k, routeInfo.destination.D),
        travelMode: google.maps.DirectionsTravelMode.BICYCLING
      }
    };

    directions_service.route(route.request, function(response, status) {
      if (status == google.maps.DirectionsStatus.OK) {
        hyperlapse.generate( {route:response} );
      } else {
        console.log(status);
      }
    });
    
  });
});