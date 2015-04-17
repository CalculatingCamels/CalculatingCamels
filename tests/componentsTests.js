
describe("An AngularJS test suite", function(){
  beforeEach(module('ngResource'), function(){
  });

  it("should have tests", function(){
  	expect(true).toBe(true);
  });

  it("should inject resources", inject( function ($resource) {
  	expect($resource).toBeDefined();
  }));

});

describe("addRoute", function(){
	beforeEach(module('Treadstone.addRoute'));

	var $controller;

	beforeEach(inject(function(_$controller_){
		$controller = _$controller_;
	}));

	describe("$scope.submit",function(){
		it("should have latitude and longitude properties", function(){
			var $scope = {};
			var controller = $controller("addRouteController", );
			$scope.lat = 1;
			$scope.lon = 1;
			expect($scope.lat).toBeDefined();
		})
	});
});





// describe("factories.js", function(){
//   beforeEach(module('Treadstone.factory'));
  
//   var factory;
//   var geo;

//   beforeEach(inject(function(geocoderFactory){
//   	geo = new google.maps.Geocoder();
//   	factory = geocoderFactory.createGeocoder('1313 Newning Ave. Austin, TX 78704');
//   }));
  
//   describe('createGeocoder', function(){
//   	it('takes a human readable address and returns an object with the HR address and a geolocation', function(){
//       //geo.geocode('1313 Newning Ave. Austin, TX 78704');
//       expect(factory['address']).toBeDefined();
//   	});
//   });
// });