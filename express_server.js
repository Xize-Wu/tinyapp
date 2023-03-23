const express = require("express");
const cookieParser = require('cookie-parser');
const { generateRandomString } = require("./generateRandomString");
const { getUserByEmail } = require("./getUserByEmail");
const app = express();
const PORT = 8080;

app.set("view engine", "ejs");//declares the ejs as the templating engine
app.use(cookieParser());


const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
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
  },
  user3RandomID: {
    id: "user3RandomID",
    email: "wuxize1995@gmail.com",
    password: "12345",
  },
};
//Look up specific user objects

app.use(express.urlencoded({ extended: true }));

app.get("/urls", (req, res) => {
  const user_id = req.cookies.user_id;
  const templateVars = { urls: urlDatabase, username: user_id };
  if (user_id) {
    const email = users[user_id].email;
    templateVars["email"] = email;
  };

  return res.render("urls_index", templateVars);
});

app.get("/urls/new", (req, res) => {
  const user_id = req.cookies.user_id;
  const templateVars = { username: user_id };
  if (user_id) {
    const email = users[user_id].email;
    templateVars["email"] = email;
  };

  res.render("urls_new", templateVars);
});


app.get("/urls/:id", (req, res) => {
  const user_id = req.cookies.user_id;
  const templateVars = { id: req.params.id, longURL: urlDatabase[req.params.id], username: user_id };
  if (user_id) {
    const email = users[user_id].email;
    templateVars["email"] = email;
  };
  res.render("urls_show", templateVars);
});

//Delete an entry from the database
app.post("/urls/:id/delete", (req, res) => {
  delete urlDatabase[req.params.id];
  res.redirect('/urls');
});

app.post("/urls", (req, res) => {
  //generate a separate var for the random string
  const key = generateRandomString();
  urlDatabase[key] = req.body.longURL;
  res.redirect(`/urls/${key}`);
  //console.log(urlDatabase);
});

app.post("/urls/:id", (req, res) => {
  urlDatabase[req.params.id] = req.body.longURL;
  res.redirect('/urls');
});


//delete cookie and log out
app.post("/logout", (req, res) => {
  res.clearCookie('user_id');
  res.redirect('/urls');
});

//Redirect to the registration page
app.get("/register", (req, res) => {
  const user_id = req.cookies.user_id;
  const email = users.user_id;
  const templateVars = { username: user_id, email };
  res.render("register", templateVars);
});

//Registeration handler!
app.post("/register", (req, res) => {
  if (!req.body.email || !req.body.password) {
    return res.status(400).send("Error: 400. Email and password could not be empty");
  }

  if (getUserByEmail(req.body.email, users)) {
    return res.status(400).send("Error: 400. An account has been created with this email.");
  }

  const key = generateRandomString();
  users[key] = {
    'id': key,
    'email': req.body.email,
    'password': req.body.password
  };

  res.cookie('user_id', key);
  res.redirect('/urls');
});

//redirect to login page
app.get('/login', (req, res) => {
  res.render("login");
});

app.post("/login", (req, res) => {
  const loginEmail = req.body.email;
  const loginPassword = req.body.password;

  for (let key in users){
    if (users[key]["email"] === loginEmail){
      if(users[key]["password"] === loginPassword){
        //console.log(users[key]['id'])
        res.cookie('user_id', users[key]['id'])
        return res.redirect('/urls');
        //res.redirect('/login')
        //console.log(req.cookies.user_id)
      }
      return res.status(403).send('Error. Wrong password.')
    } 
  }
  return res.status(403).send('Error. User does not exit in the database.')
});



app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});