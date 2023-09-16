const User = require("../models/user.model");

// Add a new user
exports.addNewUser = async (req, res) => {
  // Create and save a new user
  let userModel = new User({
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    username: req.body.username,
    password: req.body.password
  });

  //check if user already exists
  const userExits = await findUserByUsername(req);
  if(!userExits){
    userModel
    .save()
    .then(function (doc) {
      console.log(doc._id.toString());
      res.send({message: "The user has been added"});
    })
    .catch(function (error) {
      console.log(error);
      res
        .status(500)
        .send({ message: "Some error occurred while creating the user." });
    });
  }
  else
  {
    res
      .status(500)
      .send({ message: "Username already exists" });
  }

  // https://codeforgeek.com/insert-a-document-into-mongodb-using-mongoose/
};

// check if user already exists on registration 
const findUserByUsername = async (req) => {
  const usr = req.body.username;
  try {
     const user = await User.findOne({ username: usr });
     return user;
  } catch (error) {
    throw error;
  }
}

// findOne user
exports.findOneUser = async (req, res) => {
  const usr = req.body.username;
  const pwd = req.body.password;
  try {
     const user = await User.findOne({ $and: [ { username: usr }, {password: pwd  } ] });
     return user;
  } catch (error) {
    throw error;
  }
  // https://mongoosejs.com/docs/api/model.html#Model.findOne()
  // https://www.mongodb.com/docs/manual/reference/operator/query/and/
};