const express = require("express");
const app = express();
const PORT = 3000 || process.env.PORT;
const bodyParser = require("body-parser");
const cookieParser = require('cookie-parser');
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");

// All routes:
const urlsRoutes = require("./routes/urls");
const uRoutes = require("./routes/u");
const authRoutes = require("./routes/auth");

// routes are used as middleware function:
app.use("/urls", urlsRoutes);
app.use("/u", uRoutes);
app.use("/", authRoutes);

app.listen(PORT, ()=>{
  console.log(`server is listening on PORT ${PORT}`)
});