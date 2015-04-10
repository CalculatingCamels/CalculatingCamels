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
      templateUrl : 'components/Routes/routesView.html',
      controller : 'routesController' 
    })
    .when('/route/:route_id', {
      templateUrl: 'components/Route/routeView.html',
      controller: 'routeController'
    })
    .when('/route/add', {
      templateUrl: 'components/routeAddView.html',
      controller: 'routeController'
    })
})// END CONFIG

