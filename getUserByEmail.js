const getUserByEmail = function(emailInput, database) {
  for (let key in database) {
    if (database[key]["email"] === emailInput) {
      return true;
    }
  }
  return undefined;
};

module.exports = {getUserByEmail};