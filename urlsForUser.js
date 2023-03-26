const user_id = req.cookies.user_id;
const newUrls = urlsForUser(urlDatabase)
const templateVars = {urls: newUrls, username: user_id}
//const templateVars = { urls: urlDatabase, username: user_id };
if (!user_id) {
  res.send("Access denied. Please <a href ='/login'> log in </a> or <a href ='/register'> register </a>.");
} else {
  templateVars["email"] = users[user_id]["email"];
  res.render("urls_index", templateVars);
}

const urlsForUser = function(database, req){
  const user_id = req.cookies.user_id
  let result = {}
  for (const key in database){
    if (user_id === database[key]["userID"]){
      result[key] = database[key]
    }
  }
  return  result
}