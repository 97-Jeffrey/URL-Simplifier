const express = require("express");
const app = express();
const PORT = 3000 || process.env.PORT;
const bodyParser = require("body-parser");
const cookieParser = require('cookie-parser');
const {
  generateRandomString, 
  emailLookUp, 
  getPasswordByEmail, 
  correctUser, 
  urlsForUser
} = require("./helpers")
const bcrypt = require("bcrypt");
const { urlDatabase, users } = require("./data");
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");

const urlsRoutes = require("./routes/urls")
const uRoutes = require("./routes/u");


app.use("/urls", urlsRoutes);
app.use("/u", uRoutes);
app.get("/", (req,res)=>{
  res.clearCookie("user_id");
  res.redirect("/urls");
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
    const errorMessage = "The email You entered already exist, Please log in or use other emails";
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