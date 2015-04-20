angular.module('Treadstone.factory', [])

.factory('geocoderFactory', function(){
	var address;
	//address is going to be a human readable address
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
	};
});