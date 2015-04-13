angular.module('Treadstone.routes', [])
.controller('routesController', function ($scope, $routeParams){
	//TODO
	$scope.city = $routeParams.city;
	$scope.distance = $routeParams.distance;
});