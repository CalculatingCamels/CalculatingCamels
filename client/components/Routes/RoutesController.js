angular.module('Treadstone.routes', [])
.controller('routesController', function ($scope, $routeParams){
	console.log($routeParams.city, $routeParams.distance);
	//TODO
	$scope.city = $routeParams.city;
	$scope.distance = $routeParams.distance;
});