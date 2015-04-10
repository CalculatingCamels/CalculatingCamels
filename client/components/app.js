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
