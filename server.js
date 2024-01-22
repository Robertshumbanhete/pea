const express = require("express");
const app = express();

//load packages####################################

app.use(express.static(__dirname + "/public"));
app.set("view engine", "ejs");

var bodyParser = require("body-parser");

//enable url encoded Data
app.use(express.urlencoded({ extended: false }));

//environment variables
const dotenv = require("dotenv");
dotenv.config({ path: "./.env" });

const session = require("express-session");
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);

const fileUpload = require("express-fileupload");
app.use(fileUpload());

//MIDDLEWARE###############################################
const _preloaders = require("./system_modules/_preloaders");

// Dummy Log in $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
app.use((req, res, next) => {
  req.session.user_id = 5;

  next();
});

const public_routes = require("./routes/public");
app.use("", public_routes);

const account_routes = require("./routes/account");
app.use("", _preloaders._login_validation, account_routes);

const users_routes = require("./routes/users");
app.use("", _preloaders._login_validation, users_routes);

// END ROUTES ##############################################
// ERROR HANDLING - RESPONSE ###############################
app.use((req, res) => {
  res.render("error/404");
});

app.listen(3001);
