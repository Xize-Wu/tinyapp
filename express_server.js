const express = require("express");
const { generateRandomString } = require("./generateRandomString");
const app = express();
const PORT = 8080;

app.set("view engine", "ejs");//declares the ejs as the templating engine


const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

app.use(express.urlencoded({ extended: true }));

//show the app database on the index page
app.get("/urls", (req, res) => {
  const templateVars = { urls: urlDatabase };
  res.render("urls_index", templateVars);
});

//redirect to add - new page
app.get("/urls/new", (req, res) => {
  res.render("urls_new");
});

//
app.get("/urls/:id", (req, res) => {
  const templateVars = { id: req.params.id, longURL: urlDatabase[req.params.id] };
  res.render("urls_show", templateVars);
});


app.post("/urls/:id/delete", (req, res) => {
  delete urlDatabase[req.params.id];
  res.redirect('/urls');
});

app.post("/urls", (req, res) => {
  //generate a separate var for the random string
  const key = generateRandomString();
  urlDatabase[key] = req.body.longURL;
  res.redirect(`/urls/${key}`);
  console.log(urlDatabase);
});


app.post("/urls", (req, res) => {
  console.log(req.body); // Log the POST request body to the console
  res.send("Ok"); // Respond with 'Ok' (we will replace this)
});

app.post("/urls/:id", (req, res) => {
  urlDatabase[req.params.id] = req.body.longURL;
  res.redirect('/urls');
});

//Redirect to the registration page
app.get("/register", (req, res) =>{
  res.render("urls_registration")
})



app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});