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
  return undefined;
};


const urlsForUser = function(database, uid) {
  let result = {};
  for (const key in database) {
    if (uid === database[key]["userID"]) {
      result[key] = database[key];
    }
  }
  return result;
};


const testUsers = {
  "userRandomID": {
    id: "userRandomID", 
    email: "user@example.com", 
    password: "purple-monkey-dinosaur"
  },
  "user2RandomID": {
    id: "user2RandomID", 
    email: "user2@example.com", 
    password: "dishwasher-funk"
  }
}
console.log(getUserByEmail("a@b.ca", testUsers))

module.exports = {
  getUserByEmail, 
  generateRandomString,
  urlsForUser
};