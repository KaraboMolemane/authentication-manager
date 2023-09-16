const express = require("express");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");
const fs = require("fs");
const helmet = require("helmet");
const mongoose = require('mongoose');
require("dotenv").config();

const app = express();
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
const port = 8000;

// import constrollers 
const userController = require("./controllers/user.controller.js");
const orgUnitsController = require("./controllers/organisational_unit.controller.js");

// Use Helmet!
app.use(helmet());

app.get("/", (req, res) => {
  res.send("Hello world! Helmet has been implemented for security reasons.");
});

app.listen(port, () =>
  console.log(`Now listening at http://localhost:${port}`)
);

// Connect to database
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    // useMongoClient: true
  });
  mongoose.connection.on("error", function () {
    console.log("Connection to Mongo established.");
    console.log("Could not connect to the database. Exiting now...");
    process.exit();
  });
  mongoose.connection.once("open", function () {
    console.log("Successfully connected to the database");
  });

  // CRUD endpoints - Users 
app.post("/user-add-new", userController.addNewUser);

  // CRUD endpoints - OrgUnits
app.post("/org-add-new", orgUnitsController.addNewOrgUnit);


// Login endpoint 
app.post("/login", async (req, res) => {

  let result = await userController.findOneUser(req);
  if(result){
    let payload = {
      name: result.username,
      role: result.role,
    };
    const token = jwt.sign(JSON.stringify(payload), "jwt-secret", {
      algorithm: "HS256",
    });
    res.send({ token: token, message: "Login successful!" });
  }
  else{
    res.status(403).send({ message: "Incorrect login!" });
  }
});