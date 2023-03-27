const express = require("express");
const cookieParser = require('cookie-parser');
const cookieSession = require('cookie-session');
const bcrypt = require("bcryptjs");
const { generateRandomString } = require("./generateRandomString");
const { getUserByEmail } = require("./getUserByEmail");
const app = express();
const PORT = 8080;

app.set("view engine", "ejs");//declares the ejs as the templating engine
app.use(cookieParser());
app.use(
  cookieSession({
    name: 'session',
    keys: ['This is a random key']
  })
);

const urlDatabase = {
  "b2xVn2": {
    longURL: "http://www.lighthouselabs.ca",
    userID: "userRandomID"
  },
  "9sm5xK": {
    longURL: "http://www.google.com",
    userID: "userRandomID"
  }
};

const users = {
  userRandomID: {
    id: "userRandomID",
    email: "user@example.com",
    password: "purple-monkey-dinosaur",
  },
  user2RandomID: {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "dishwasher-funk",
  }
};

//Look up specific user objects
app.use(express.urlencoded({ extended: true }));

const urlsForUser = function(database, uid) {
  let result = {};
  for (const key in database) {
    if (uid === database[key]["userID"]) {
      result[key] = database[key];
    }
  }
  return result;
};

//index page
app.get("/urls", (req, res) => {
  const user_id = req.session["user_id"];
  if (!user_id) {
    res.send("Access denied. Please <a href ='/login'> log in </a> or <a href ='/register'> register </a>.");
  } else {
    const templateVars = {user: users[user_id], urls: urlsForUser(urlDatabase, req.session["user_id"]) };
    console.log(templateVars.urls)
    //console.log("User: ", templateVars.user)
    //console.log(user_id)
    // const newUrls = urlsForUser(urlDatabase, user_id);
    // const templateVars = { urls: newUrls, username: user_id };
    // templateVars["email"] = users[user_id]["email"];
    res.render("urls_index", templateVars);
  }
});

//go to add new url page
app.get('/urls/new', (req, res) => {
  const user_id = req.session["user_id"];
  if (user_id) {
    const templateVars = { user: users[user_id] };
    //templateVars['email'] = users[user_id];
    res.render("urls_new", templateVars);
  } else {
    return res.redirect("/login");
  }
});

app.get("/urls/:id", (req, res) => {
  const user_id = req.session["user_id"];
  const templateVars = { id: req.params.id, longURL: urlDatabase[req.params.id]["longURL"], user: users[user_id] };
  if (!user_id) {
    return res.send("Access denied. Please <a href ='/login'> log in </a>.");
  } else if (!Object.keys(urlDatabase).includes(req.params.id)) {
    return res.status(401).send("Error: 401. Short url does not exist in the database.");
  } else if (user_id !== urlDatabase[req.params.id]["userID"]) {
    return res.send("Access denied. You do not have access to this page.");
  } else {
    // const email = users[user_id].email;
    // templateVars["email"] = email;
    res.render("urls_show", templateVars);
  }
});



app.get("/u/:id", (req,res) =>{
  const urlObj = urlDatabase[req.params.id]
  console.log(urlObj)
  // console.log("id", req.params.id)
  // console.log("long", longURL)
  if(!urlObj){
    return res.status(404).send("Short url is not in the database.")
  } else {
    //console.log(urlDatabase)
    return res.redirect(urlObj.longURL)
  }
})

//Delete an entry from the database
app.post("/urls/:id/delete", (req, res) => {
  const user_id = req.session["user_id"];
  if (!user_id) {
    return res.send("Access denied. Please <a href ='/login'> log in </a>.");
  } else if (!Object.keys(urlDatabase).includes(req.params.id)) {
    return res.status(401).send("Error: 401. Short url does not exist in the database.");
  } else if (user_id !== urlDatabase[req.params.id]["userID"]) {
    return res.send("Access denied. You do not have access to this page.");
  } else {
    delete urlDatabase[req.params.id];
    res.redirect('/urls');
  }
});

//post an url to database
app.post("/urls", (req, res) => {
  const user_id = req.session["user_id"];
  if (user_id) {
    const key = generateRandomString();
    urlDatabase[key] = {
      longURL: req.body.longURL,
      userID: req.session.user_id
    };
    res.redirect(`/urls/${key}`);
  } else {
    return res.send("Must log in before posting.");
  }
});

app.post("/urls/:id", (req, res) => {
  urlDatabase[req.params.id] = {
    longURL: req.body.longURL,
    userID: req.session.user_id
  };
  res.redirect('/urls');
});

//delete cookie and log out
app.post("/logout", (req, res) => {
  req.session = null;
  res.redirect('/login');
});

//Redirect to the registration page
app.get("/register", (req, res) => {
  const user_id = req.session["user_id"];
  if (user_id) {
    return res.redirect('/urls');
  } else {
    const user = users[user_id];
    const templateVars = { user };
    res.render("register", templateVars);
  }
});

//Registeration handler!
app.post("/register", (req, res) => {
  if (!req.body.email || !req.body.password) {
    return res.status(400).send("Error: 400. Email and password could not be empty");
  } else if (getUserByEmail(req.body.email, users)) {
    return res.status(400).send("Error: 400. An account has been created with this email.");
  } else {
    const hashedPassword = bcrypt.hashSync(req.body.password, 10);
    const key = generateRandomString();
    users[key] = {
      'id': key,
      'email': req.body.email,
      'password': hashedPassword
    };
    req.session['user_id'] = key;
    //console.log(req.session['user_id'])
    //res.cookie('user_id', key);
    res.redirect('/urls');
  }
});

//redirect to login page
app.get('/login', (req, res) => {
  const user_id = req.session["user_id"];
  if (user_id) {
    return res.redirect('/urls');
  } else {
    const user = users[user_id];
    const templateVars = { user };
    res.render("login", templateVars);
  }
});

//login
app.post("/login", (req, res) => {
  const loginEmail = req.body.email;
  const loginPassword = req.body.password;
console.log(`Email: ${loginEmail}; password: ${loginPassword}`)
  for (let key in users) {
    if (users[key]["email"] === loginEmail) {
      if (bcrypt.compareSync(loginPassword, users[key]["password"])) {
        req.session.user_id = key;
        //res.cookie('user_id', users[key]['id']);
        return res.redirect('/urls');
      }
      return res.send("wrong password User does not exist in the database, or the password is wrong. Please <a href ='/login'> try again </a>");
    }
  }
  return res.send("User does not exist in the database, or the password is wrong. Please <a href ='/login'> try again </a>");
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});