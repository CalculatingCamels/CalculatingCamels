angular.module('Treadstone.signup', [])


.controller('signupController', function ($scope, $http){
  $scope.error = '';
  $scope.submit = function(){
    $http({
      method: 'POST',
      url: '/api/signup',
      data: {username : $scope.username , password : $scope.password},
    }).then(function(data){
      console.log('data', data);
      if(data.data.valid){
        //store username
        
      }else{
        $scope.error = 'That username is already taken!';
      }
    })
    $scope.username = '';
    $scope.password = '';
  }


})


