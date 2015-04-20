//Used for determining if an object is a number.
exports.isNumeric = function(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}

//Used to prepare the city string for insertion into the database.
exports.formatCity = function(city){
  return city.split(' ').join('').toLowerCase();
}