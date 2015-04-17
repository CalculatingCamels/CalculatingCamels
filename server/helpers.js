var bcrypt = require('bcrypt');

exports.hashPassword = function(str){
  var salt = bcrypt.genSaltSync();
  return bcrypt.hashSync(str, salt);
}

exports.checkPassword = function(plain, hash){
  return bcrypt.compareSync(plain, hash);
}

exports.isNumeric = function(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}

exports.formatCity = function(city){
  return city.split(' ').join('').toLowerCase();
}