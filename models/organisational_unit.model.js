const mongoose = require("mongoose");

// Create schema
const OrgUnitsShema = mongoose.Schema({
  id: {
    type: String,
    unique: true,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  departments: 
    [{
      id: {type: String, required: false, unique: true},
      name: {type: String, required: false},
      repo: [{
        // _id: {type: String, required: false, unique: true},
        name: {type: String, required: false, unique: true},
        url: {type: String, required: false},
        username: {type: String, required: false},
        password: {type: String, required: false},
      }],
    }],
});

// Create Model
const OrgUnitsModel = mongoose.model("organisational_units", OrgUnitsShema);
module.exports = OrgUnitsModel;
