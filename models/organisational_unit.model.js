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
    type: String,
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
const UserModel = mongoose.model("User", UserSchema);
module.exports = UserModel;
