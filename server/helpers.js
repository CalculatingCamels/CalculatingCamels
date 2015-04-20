exports.isNumeric = function(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}

exports.formatCity = function(city){
  return city.split(' ').join('').toLowerCase();
}