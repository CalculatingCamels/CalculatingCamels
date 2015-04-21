angular.module('Treadstone.routes', [])
.controller('routesController', function ($scope, $routeParams, $http){
	
  //Sets scope.city to url params city
	$scope.city = $routeParams.city;
  $scope.routes = [];
  $scope.msg = 'Loading routes...';

  // the position instance has "coords" object on it with latitude and longitude properties. 
  // getCity queries googlemaps api with the lat/lon coordinates. googlemaps api returns a response
  // with a data array. results[5] from the array returns the city.   

  $scope.renderMap = function(position){
    var featureOpts = [{"featureType":"all","elementType":"labels","stylers":[{"visibility":"off"}]},{"featureType":"all","elementType":"labels.text.stroke","stylers":[{"visibility":"off"}]},{"featureType":"all","elementType":"labels.icon","stylers":[{"visibility":"off"}]},{"featureType":"administrative","elementType":"geometry.fill","stylers":[{"color":"#000000"},{"lightness":20}]},{"featureType":"administrative","elementType":"geometry.stroke","stylers":[{"color":"#000000"},{"lightness":17},{"weight":1.2}]},{"featureType":"landscape","elementType":"geometry","stylers":[{"color":"#000000"},{"lightness":20}]},{"featureType":"poi","elementType":"geometry","stylers":[{"color":"#000000"},{"lightness":21}]},{"featureType":"road.highway","elementType":"geometry.fill","stylers":[{"color":"#000000"},{"lightness":17}]},{"featureType":"road.highway","elementType":"geometry.stroke","stylers":[{"color":"#000000"},{"lightness":29},{"weight":0.2}]},{"featureType":"road.arterial","elementType":"geometry","stylers":[{"color":"#000000"},{"lightness":18}]},{"featureType":"road.local","elementType":"geometry","stylers":[{"color":"#000000"},{"lightness":16}]},{"featureType":"transit","elementType":"geometry","stylers":[{"color":"#000000"},{"lightness":19}]},{"featureType":"water","elementType":"geometry","stylers":[{"color":"#000000"},{"lightness":17}]}];
    var mapOptions = {
      zoom: 14,
      center: new google.maps.LatLng(position.coords.latitude, position.coords.longitude),
      scrollwheel: false,
      styles : featureOpts,
      disableDefaultUI : true,
      draggable : false
    }
    var map = new google.maps.Map(document.getElementById('map-background'), mapOptions);
  };

  //Fetches an array with routes for selected city.
  $http({
    method: "GET",
    url: "/api/routes/" + $scope.city
  }).then(function(routes){
    if(routes.data[0].hasOwnProperty('error')){
      $scope.msg = 'There are no routes in your city yet!';
    } else {
      $scope.msg = '';
      $scope.routes = routes.data;
      $scope.routes.map(function(route){
        route.data = JSON.parse(route.data)
      });
    }
  });

});