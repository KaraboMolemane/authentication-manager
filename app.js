const express = require("express");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");
const fs = require("fs");
const helmet = require("helmet");
const mongoose = require("mongoose");

const app = express();
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
const port = 8000;

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
  });
  mongoose.connection.on("error", function () {
    console.log("Connection to Mongo established.");
    console.log("Could not connect to the database. Exiting now...");
    process.exit();
  });
  mongoose.connection.once("open", function () {
    console.log("Successfully connected to the database");
  });
