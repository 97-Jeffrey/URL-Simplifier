const express = require("express");
const app = express();
const PORT = 3000 || process.env.PORT;
const bodyParser = require("body-parser");
const cookieParser = require('cookie-parser');
const bcrypt = require("bcrypt");
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");


const urlDatabase = {
  "b2xVn2": { longURL:"http://www.lighthouselabs.ca", userID:"userRandomID" },
  "9sm5xK":{ longURL: "http://www.google.com", userID:"user2RandomID" }
};

const users ={
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

function generateRandomString(){
  let str ="abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890";
  let output = "";
  for(let i=0; i<6; i++){
    output += str[Math.floor(Math.random()*str.length)];
  }
  return output;
}

function emailLookUp(users, email){
  for(let user in users){
    if(users[user]["email"] == email){
      return true;
    }
  }
  return false;
}

function getPasswordByEmail(email, users){
  for(let user in users){
    if(users[user]['email'] == email){
      return users[user]["password"];
    }  
  }
  return "";
}

function correctUser(users, email){
  for(let user in users){
    if(users[user]['email'] == email){
      return users[user];
    }
  }
  return {};
}

function urlsForUser(urlDatabase, userId){
   let output ={};
   for(let url in urlDatabase){
     if(urlDatabase[url]["userID"] == userId){
       output[url] = urlDatabase[url];
     }
   }
   return output;
}

app.get("/", (req,res)=>{
  res.clearCookie("user_id");
  res.redirect("/urls");
})

app.get("/urls", (req,res)=>{
  const templateVars = { urls: urlsForUser(urlDatabase,req.cookies["user_id"]), user: users[req.cookies['user_id']] };
  res.render("urls_index", templateVars)
})

app.get("/urls/new", (req,res)=>{
  const templateVars = { 
    user: users[req.cookies['user_id']]
  }
  if(!req.cookies["user_id"]){
    res.redirect("/login");
  }else{
    res.render("urls_new", templateVars);
  }
  
})

// Add a new url into urls;
app.post("/urls", (req,res)=>{
  const { longURL } = req.body;
  const shortURL = generateRandomString();
  urlDatabase[shortURL] = {longURL, userID:req.cookies['user_id']};
  res.redirect(`/urls/${shortURL}`);
})

// Details of each url
app.get("/urls/:shortURL", (req,res)=>{
  const { shortURL } = req.params;
  const templateVar = {
    shortURL, 
    longURL:urlDatabase[shortURL]["longURL"],
    user: users[req.cookies['user_id']]
  };
  const userId = req.cookies["user_id"];
  if(urlDatabase[shortURL].userID !== userId){
    res.redirect("/urls");
    console.log("CAN NOT BE EDITED")
  }
  res.render("urls_show", templateVar);
})

// Delete a url
app.post("/urls/:shortURL/delete", (req,res)=>{
  const { shortURL } = req.params;
  const userId = req.cookies["user_id"];
  if(urlDatabase[shortURL].userID !== userId){
    res.redirect('/urls');
    console.log("CAN BE DELETED")
  }else{
    delete urlDatabase[shortURL];
    res.redirect("/urls");
  }
})

// Edit url:
app.post("/urls/:id", (req,res)=>{
  const { id } = req.params;
  const { longURL } = req.body;
  if(!longURL){
    res.redirect("back");
    return;
  }
  urlDatabase[id] = { longURL, userID: req.cookies["user_id"] };
  res.redirect("/urls");
  
})

// Use shortened url as replacements to browse instead of the long one:
app.get("/u/:shortURL", (req,res)=>{
  const { shortURL } = req.params;
  const longURL = urlDatabase[shortURL]["longURL"];
  res.redirect(longURL);
})

// user register here:
app.get("/register",(req,res)=>{
  const templateVars = { 
    urls: urlDatabase, 
    user: users[req.cookies['user_id']],
    errorMessage:""
  };
  res.render("urls_register", templateVars)
})

app.post("/register", (req,res)=>{
  const { email, password } = req.body;
  if(!email || !password){
    const errorMessage = "Oh no, Your Email Or Password Could Not Be Empty";
    const templateVars = { 
      urls: urlDatabase, 
      user: users[req.cookies['user_id']],
      errorMessage
    };
    
    res.render("urls_register", templateVars);
    return;
  }
  else if(emailLookUp(users, email)){
    const errorMessage = "The Email You Entered Is Used By Others, Please Use Other Emails";
    const templateVars = { 
      urls: urlDatabase, 
      user: users[req.cookies['user_id']],
      errorMessage
    };
    res.render("urls_register", templateVars);
    return;
  }else{
    const id = generateRandomString();
    const hashedPassword = bcrypt.hashSync(password,10);
    const user = {id, email, password:hashedPassword };
    console.log(hashedPassword);
    users[id] = user;
    console.log("this is entire user list", users);
    res.cookie("user_id", id);
    res.redirect("/urls");

  }
})

// Login here:
app.get("/login", (req,res)=>{
  const templateVars = { 
    user: users[req.cookies['user_id']],
    errorMessage:""
  };
  res.render("urls_login", templateVars);
})

app.post("/login", (req,res)=>{
  const { email, password } = req.body;
  const hashedPassword = getPasswordByEmail(email, users);
  if(!emailLookUp(users, email)){
    const templateVars = { 
      user: users[req.cookies['user_id']],
      errorMessage:"Your Email Are Not Found, Please Register First"
    };
    res.render("urls_login", templateVars)
    return;
    // res.status(403).send("Your Email are not found, please Register first");
  }
  else if(!bcrypt.compareSync(password.toString(), hashedPassword.toString())){
    const templateVars = { 
      user: users[req.cookies['user_id']],
      errorMessage:"Your Password Does Not Match, Please Re-enter"
    };
    res.render("urls_login", templateVars);
  }else{
    let user =  correctUser(users, email);
    res.cookie("user_id", user["id"]);
    res.redirect("/urls");
  }
})

// Logout:
app.post("/logout", (req,res)=>{
  res.clearCookie("user_id");
  res.redirect("/urls");
})

app.listen(PORT, ()=>{
  console.log(`server is listening on PORT ${PORT}`)
});