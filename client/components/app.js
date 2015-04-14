angular.module("Treadstone" , ['Treadstone.home',
                               'Treadstone.routes',
                               'Treadstone.route',
                               'Treadstone.addRoute',
                               'Treadstone.signup',
                               'Treadstone.login',
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
    .when('/route/add', {
      templateUrl: 'components/addRoute/addRouteView.html',
      controller: 'addRouteController'
    })
    .when('/route/:route_id', {
      templateUrl: 'components/Route/routeView.html',
      controller: 'routeController'
    })
    .when('/login', {
      templateUrl: 'components/auth/loginView.html',
      controller: 'loginController'
    })
    .when('/signup', {
      templateUrl: 'components/auth/signupView.html',
      controller: 'signupController'
    })
})// END CONFIG

