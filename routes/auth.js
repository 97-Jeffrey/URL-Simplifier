const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const {
  generateRandomString, 
  emailLookUp, 
  getPasswordByEmail, 
  correctUser
} = require("../helpers");
const { urlDatabase, users } = require("../data");

router.get("/", (req,res)=>{
  res.clearCookie("user_id");
  res.redirect("/urls");
})

router.get("/register",(req,res)=>{
  const templateVars = { 
    urls: urlDatabase, 
    user: users[req.cookies['user_id']],
    errorMessage:""
  };
  res.render("urls_register", templateVars)
})

router.post("/register", (req,res)=>{
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

router.get("/login", (req,res)=>{
  const templateVars = { 
    user: users[req.cookies['user_id']],
    errorMessage:""
  };
  res.render("urls_login", templateVars);
})

router.post("/login", (req,res)=>{
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
  else if(!password){
    const templateVars = { 
      user: users[req.cookies['user_id']],
      errorMessage:"Please Enter Your password"
    };
    res.render("urls_login", templateVars);
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

router.post("/logout", (req,res)=>{
  res.clearCookie("user_id");
  res.redirect("/urls");
})


module.exports = router;