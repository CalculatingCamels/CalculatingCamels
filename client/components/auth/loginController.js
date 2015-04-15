angular.module('Treadstone.login', [])

.controller('loginController', function ($scope, $http){
  $scope.submit = function(){
    $http({
      method: 'POST',
      url: '/api/signin',
      data: {username : $scope.username , password : $scope.password},
    }).then(function(data){
      console.log('data', data);
      if(data.valid){
        //store username
      }else{
        //actually display this. 
        console.log("Invalid Username or Password");
      }
    })
  }


})



