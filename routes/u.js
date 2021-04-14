const express = require("express");
const router = express.Router();
const { urlDatabase} = require("../data");

router.get("/:shortURL", (req,res)=>{
  const { shortURL } = req.params;
  const longURL = urlDatabase[shortURL]["longURL"];
  res.redirect(longURL);
})

module.exports = router;