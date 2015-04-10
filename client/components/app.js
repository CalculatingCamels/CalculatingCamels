angular.module("Treadstone" , ['Treadstone.home',
                               'Treadstone.routes',
                               'Treadstone.route',
                               'ui.bootstrap',
                               'ngRoute'
                              ])

.config( function ( $routeProvider ){
  $routeProvider
    .when('/', {
      templateUrl : 'components/home/homeView.html',
      controller  : 'homeController'
    })
    .when('/search/:city/:distance', {
      templateUrl : 'routes/routesView.html',
      controller : 'routes/routesController' 
    })
    .when('/route/:route_id', {
      templateUrl: 'routeView.html',
      controller: 'routeController'
    })
    .when('/route/add', {
      templateUrl: 'routeAddView',
      controller: 'routeController'
    })
})// END CONFIG
<<<<<<< HEAD


// angular.module('ui.bootstrap').controller('ButtonsCtrl', function ($scope) {
//   $scope.singleModel = 1;

//   $scope.radioModel = 'Middle';

//   $scope.checkModel = {
//     left: false,
//     middle: true,
//     right: false
//   };
// });
=======
>>>>>>> c13143c04f05af0ba54b5ebfd42cd53e68ae5171
