const User = require("../models/user.model");

// Add a new user
exports.addNewUser = async (req, res) => {
  // Create and save a new user
  let userModel = new User({
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    username: req.body.username,
  });

  userModel
    .save()
    .then(function (doc) {
      console.log(doc._id.toString());
      res.send("The user has been added");
    })
    .catch(function (error) {
      console.log(error);
      res
        .status(500)
        .send({ message: "Some error occurred while creating the user." });
    });
  // https://codeforgeek.com/insert-a-document-into-mongodb-using-mongoose/
};