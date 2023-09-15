const mongoose = require("mongoose");

// Create schema
const OrgUnitsShema = mongoose.Schema({
  id: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  departments: {
    type: Array,
    required: true,
    default: [
      {
        id: "",
        name: "",
        repo: [
          {
            name: "",
            url: "",
            username: "",
            password: "",
          },
        ],
      },
    ],
  },
});

// Create Model
const OrgUnitsModel = mongoose.model("organisational_units", OrgUnitsShema);
module.exports = OrgUnitsModel;
