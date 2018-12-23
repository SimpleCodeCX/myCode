var userData = require('./userData');

function getById(id) {
  return userData.find((user) => {
    return user.id == id;
  });
}

function getByName(name) {
  return userData.find((user) => {
    return user.name == name;
  });
}

function getByAge(age) {
  return userData.filter((user) => {
    return user.age == age;
  });
}

module.exports.getById = getById;
module.exports.getByName = getByName;
module.exports.getByAge = getByAge;