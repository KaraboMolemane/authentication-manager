const User = require("../models/user.model");
const jwt = require("jsonwebtoken");
var cookieSession = require("cookie-session");

// Add a new user
exports.addNewUser = async (req, res) => {
  // Create and save a new user
  let userModel = new User({
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    username: req.body.username,
    password: req.body.password,
  });

  //check if user already exists
  const userExits = await findUserByUsername(req);
  if (!userExits) {
    userModel
      .save()
      .then(function (doc) {
        console.log(doc._id.toString());
        res.send({ message: "The user has been added" });
      })
      .catch(function (error) {
        console.log(error);
        res
          .status(500)
          .send({ message: "Some error occurred while creating the user." });
      });
  } else {
    res.status(500).send({ message: "Username already exists" });
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
};

// Get all users
exports.getAllUsers = async (req, res) => {
  try {
    result = await User.find({});
    res.send(result);
  } catch (error) {
    res.sendStatus(401);
  }
  // https://mongoosejs.com/docs/api/model.html#Model.find()
};

// Login
exports.userLogin = async (req, res) => {
  let result = await findOneUser(req);
  if (result) {
    let payload = {
      username: result.username,
      role: result.role,
      departments: result.positions[0].departments_ids,
    };
    const token = jwt.sign(JSON.stringify(payload), "jwt-secret", {
      algorithm: "HS256",
    });
    res.cookie("token", token).send({
      message: "Login successful!",
      username: result.username,
      firstname: result.firstname,
      lastname: result.lastname,
      role: result.role,
    });
    // res.send({ token: token, message: "Login successful!" });
  } else {
    res.status(403).send({ message: "Incorrect login!" });
  }
  // https://www.w3schools.com/jsref/prop_win_sessionstorage.asp
  // http://expressjs.com/en/resources/middleware/cookie-session.html
  // https://stackoverflow.com/questions/10090414/express-how-to-pass-app-instance-to-routes-from-a-different-file
  // https://www.geeksforgeeks.org/how-to-separate-routers-and-controllers-in-node-js/
  // https://stackoverflow.com/questions/70210620/how-to-send-jwt-to-front-end-server-after-successful-login-for-storage-on-locals
  // https://stackoverflow.com/questions/56273618/is-it-bad-to-pass-jwt-token-as-part-of-url
  // https://www.tutorialspoint.com/expressjs/expressjs_cookies.htm - WORKS !!!
};

// findOne user
const findOneUser = async (req) => {
  const usr = req.body.username;
  const pwd = req.body.password;
  try {
    const user = await User.findOne({
      $and: [{ username: usr }, { password: pwd }],
    });
    return user;
  } catch (error) {
    throw error;
  }
  // https://mongoosejs.com/docs/api/model.html#Model.findOne()
  // https://www.mongodb.com/docs/manual/reference/operator/query/and/
};

// Logout
exports.userLogOut = async (req, res) => {
  try {
    res.clearCookie("token");
    res.send({ msg: "Logged out, enjoy your day!" });
  } catch (error) {
    res.send({
      msg: "Operation failed. Please try again or contact your admin.",
    });
  }
};

exports.editUserRole = async (req, res) => {
  try {
    const token = req.headers["authorization"].split(" ")[1];
    const decoded = jwt.verify(token, "jwt-secret");
    if (decoded.role === "admin") {
      // Get an array of changes from the body
      const changes = req.body;
      if (changes.length !== 0) {
        changes.forEach(async (element) => {
          const filter = { _id: element.key };
          const update = { role: element.data.role };
          const result = await User.findOneAndUpdate(filter, update, {
            new: true,
          });
        });
      }
      res.send({ msg: "The user role has been updated" });
    } else {
      res.status(403).send({
        msg: "Your JWT was verified, but you do not have access to this resource. Please contact your admin to get access to this resource.",
      });
    }
  } catch (error) {
    console.log("error", error);
    res.sendStatus(401);
  }
  // https://mongoosejs.com/docs/tutorials/findoneandupdate.html
};
