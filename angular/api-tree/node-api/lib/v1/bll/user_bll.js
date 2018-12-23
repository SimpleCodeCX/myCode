var userDal = require('../dal').userDal;

function getById(id) {
  return userDal.getById(id);
}

function getByName(name) {
  return userDal.getByName(name);
}

function getByAge(age) {
  return userDal.getByAge(age);
}

module.exports.getById = getById;
module.exports.getByName = getByName;
module.exports.getByAge = getByAge;