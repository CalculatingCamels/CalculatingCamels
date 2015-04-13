var bcrypt = require('bcrypt');

exports.hashPassword = function(str){
  var salt = bcrypt.genSaltSync();
  return bcrypt.hashSync(str, salt);
}

exports.checkPassword = function(plain, hash){
  return bcrypt.compareSync(plain, hash);
}