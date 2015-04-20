angular.module('Treadstone.routes', [])
.controller('routesController', function ($scope, $routeParams, $http){
	
	$scope.city = $routeParams.city;
  $scope.routes = [];

  $http({
    method: "GET",
    url: "/api/routes/" + $scope.city
  }).then(function(routes){
    $scope.routes = routes.data;
    $scope.routes.map(function(route){
      route.data = JSON.parse(route.data)
    })
  });

});