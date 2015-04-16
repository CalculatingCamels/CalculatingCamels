angular.module('Treadstone.routes', [])
.controller('routesController', function ($scope, $routeParams){
	
	$scope.city = $routeParams.city;
	$scope.distance = $routeParams.distance;
});