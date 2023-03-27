const { assert } = require('chai');
const { getUserByEmail, generateRandomString, urlsForUser } = require("./helpers");

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
};

describe('getUserByEmail', function() {
  it('should return a user with valid email', function() {
    const user = getUserByEmail("user@example.com", testUsers);
    const expectedUserID = "userRandomID";
    assert(user, expectedUserID, `Error. User value is ${user}. Expecting ${expectedUserID}.`);
  });

  it('test that a non-existent email returns undefined', function() {
    const user = getUserByEmail("lighthouse@donotexist.ca", testUsers);
    assert.strictEqual(user, undefined, `Error. User value is ${user} `);
  });
});

