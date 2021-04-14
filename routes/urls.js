const express = require("express");
const router = express.Router();
const {
  generateRandomString, 
  emailLookUp, 
  getPasswordByEmail, 
  correctUser, 
  urlsForUser
} = require("../helpers");
const { urlDatabase, users } = require("../data");

router.get("/", (req,res)=>{
  const templateVars = { urls: urlsForUser(urlDatabase,req.cookies["user_id"]), user: users[req.cookies['user_id']] };
  res.render("urls_index", templateVars)
})

router.get("/new", (req,res)=>{
  const templateVars = { 
    user: users[req.cookies['user_id']]
  }
  if(!req.cookies["user_id"]){
    res.redirect("/login");
  }else{
    res.render("urls_new", templateVars);
  }
})

router.post("/", (req,res)=>{
  const { longURL } = req.body;
  const shortURL = generateRandomString();
  urlDatabase[shortURL] = {longURL, userID:req.cookies['user_id']};
  res.redirect(`/urls/${shortURL}`);
})

router.get("/:shortURL", (req,res)=>{
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


router.post("/:shortURL/delete", (req,res)=>{
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

router.post("/:id", (req,res)=>{
  const { id } = req.params;
  const { longURL } = req.body;
  if(!longURL){
    res.redirect("back");
    return;
  }
  urlDatabase[id] = { longURL, userID: req.cookies["user_id"] };
  res.redirect("/urls");
  
})
module.exports = router;
