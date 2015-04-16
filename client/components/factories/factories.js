angular.module('Treadstone.factory', [])
.factory('geocoderFactory', function(){
	var address;
	//addr is going to be a string of human readable address.

	//documentation on google maps geocoding API: 

	//[https://developers.google.com/maps/documentation/geocoding/]
    
    //geocoding is the process of turning a human readable address into
    //latitude and longitude coordinates.
	function createGeocoder(addr, cb){
		address = addr;
		var geocoder = new google.maps.Geocoder();
		geocoder.geocode({'address': addr }, function(results, status){
			cb(results, status);
		})
		
	}
	return {
		address: address,
		createGeocoder: createGeocoder
	}
})