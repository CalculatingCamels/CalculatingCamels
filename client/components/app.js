angular.module("Treadstone" , ['Treadstone.home',
                               'ui.bootstrap',
                               'ngRoute'
                              ])

.config( function ( $routeProvider ){
  $routeProvider
    .when('/', {
      templateUrl : 'components/homeView.html',
      controller  : 'homeController'
    })
})// END CONFIG


angular.module('ui.bootstrap').controller('ButtonsCtrl', function ($scope) {
  $scope.singleModel = 1;

  $scope.radioModel = 'Middle';

  $scope.checkModel = {
    left: false,
    middle: true,
    right: false
  };
});
