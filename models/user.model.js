const mongoose = require("mongoose");

// Create schema
const UserSchema = mongoose.Schema({
  firstname: {
    type: String,
    required: true,
    default: "firstname",
  },
  lastname: {
    type: String,
    required: true,
    default: "lastname",
  },
  username: {
    type: String,
    required: true,
    unique: true,
    default: "username",
  },
  password: {
    type: String,
    required: true,
    default: "pass123",
  },
  role: {
    type: String,
    required: false,
    default: "normal",
  },
  positions: {
    type: Array,
    required: false,
    default: [
      {
        OU_ids: [],
        departments_ids: [],
      },
    ],
  }
});

// Create Model
const UserModel = mongoose.model("users", UserSchema);
module.exports = UserModel;
