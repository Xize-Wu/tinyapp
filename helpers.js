const generateRandomString = function() {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = "";
  for (let i = 0; i < 6; i ++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
};

const getUserByEmail = function(emailInput, database) {
  for (let key in database) {
    if (database[key]["email"] === emailInput) {
      return true;
    }
  }
  return false;
};

module.exports = {getUserByEmail, generateRandomString};