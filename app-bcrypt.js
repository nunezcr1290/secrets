//jshint esversion:6
require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const encrypt = require('mongoose-encryption');
// const md5 = require("md5");
const bcrypt = require('bcrypt');
const saltRounds = 10;

const app = express();

app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
  extended: true
}));

mongoose.connect("mongodb://localhost:27017/userDB");

const userSchema = new mongoose.Schema({
  email: String,
  password: String
});


// const secret = "Thisisourlittlesecret.";

// const secret = process.env.SECRET
// userSchema.plugin(encrypt, {secret:secret, encryptedFields:["password"] });


const User = new mongoose.model("User", userSchema);



app.get("/", function(req, res){
res.render("home");
});

app.get("/login", function(req, res){
res.render("login");
});

app.get("/register", function(req, res){
res.render("register");
});

app.get("/logout", function(req, res){
res.redirect("/");
});

app.post("/register", function(req, res){

  bcrypt.genSalt(saltRounds, function(err, salt) {
      bcrypt.hash(req.body.password, salt, function(err, hash) {

        const entered = new User ({
          email: req.body.username,
          // password: md5(req.body.password)
          password: hash
        });

        entered.save(function(err){
          if (err){
            console.log(err)
          }else {
            res.render("secrets");
          }
        });

      });
  });

});

app.post("/login", function(req, res){

const username = req.body.username;
// const password = md5(req.body.password);
const password = req.body.password;

User.findOne({email: username}, function(err, found){
  if (err){
    console.log(err);
  }else{
    if (found){
      bcrypt.compare(password, found.password , function(err, result) {
          if (result === true) {
            res.render("secrets")
          }
      });
      // if (found.password === password){
      // res.render("secrets")
      //}
    }
  }
});

});



app.listen(process.env.PORT || 3000, function() {
  console.log("Server started on port 3000");
});
