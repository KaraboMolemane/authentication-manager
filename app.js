const express = require("express");
const bodyParser = require("body-parser");

const fs = require("fs");
const helmet = require("helmet");
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');

require("dotenv").config();

const app = express();
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(cookieParser());
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

//endpoints - Users 
app.post("/user-add-new", userController.addNewUser);
app.post("/login", userController.userLogin);
app.get("/logout", userController.userLogOut);


// endpoints- OrgUnits
app.post("/org-add-new", orgUnitsController.addNewOrgUnit);
app.get("/get-all-org-units", orgUnitsController.getAllOrgUnits);
app.post("/get-depts-by-org-unit-id", orgUnitsController.getDepartmentsByOrgUnitId);
app.post("/get-org-unit-repos-by-ids", orgUnitsController.getOUDeptReposByIds);
app.post("/get-dept-repo-for-user", orgUnitsController.getDeptRepoForUser)
app.put("/add-new-credentials-to-dept-repo", orgUnitsController.addNewCredentialsToDeptRepo);
app.put("/edit-dept-repo-credentials", orgUnitsController.editDeptRepoCredentials);


