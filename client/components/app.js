angular.module("Treadstone" , ['Treadstone.home',
                               'Treadstone.routes',
                               'Treadstone.route',
                               'Treadstone.addRoute',
                               'Treadstone.factory',
                               'Treadstone.about',
                               'ui.bootstrap',
                               'ngRoute'
                              ])

.config( function ( $routeProvider ){
  $routeProvider
    .when('/', {
      templateUrl : 'components/home/homeView.html',
      controller  : 'homeController'
    })
    .when('/search/:city', {
      templateUrl : 'components/Routes/routesView.html',
      controller : 'routesController' 
    })
    .when('/route/add', {
      templateUrl: 'components/addRoute/addRouteView.html',
      controller: 'addRouteController'
    })
    .when('/route/:route_id', {
      templateUrl: 'components/Route/routeView.html',
      controller: 'routeController'
    })
    .when('/about',{
      templateUrl: 'components/about/aboutView.html',
      controller: 'aboutController'
    });
});
