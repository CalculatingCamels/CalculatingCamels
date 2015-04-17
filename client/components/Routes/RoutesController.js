angular.module('Treadstone.routes', [])
.controller('routesController', function ($scope, $routeParams, $http){
	
	$scope.city = $routeParams.city;
  $scope.routes = [];
  $scope.supported;

  $scope.init = function(){
    $http({
      method: "GET",
      url: "/api/routes/" + $scope.city
    }).then(function(data){
      console.log(Array.isArray(data));
      debugger;
      $scope.routes = data.data;
      //You have to parse the data coming from the server
      $scope.routes.map(function(item){
        item.data = JSON.parse(item.data)
      })
    })
  }
  //Calls init to get routes. 
  $scope.init();

  if($scope.routes.hasOwnProperty("error")){

  }
  

});