const OrganisationalUnit = require("../models/organisational_unit.model");
const jwt = require("jsonwebtoken");

// Add a new organisational_unit
exports.addNewOrgUnit = async (req, res) => {
  // Create and save a new organisational_unit
  let orgUnitModel = new OrganisationalUnit({
    id: req.body.id,
    name: req.body.name,
  });

  orgUnitModel
    .save()
    .then(function (doc) {
      console.log(doc._id.toString());
      res.send("The organisational_unit has been added");
    })
    .catch(function (error) {
      console.log(error);
      res.status(500).send({
        message: "Some error occurred while creating the organisational_unit.",
      });
    });
  // https://codeforgeek.com/insert-a-document-into-mongodb-using-mongoose/
};

// Get all Organisational Units
exports.getAllOrgUnits = async (req, res) => {
  try {
    const orgUnits = await OrganisationalUnit.find({});
    res.send(orgUnits);
  } catch (error) {
    throw error;
  }
};

// Get departments belonging to an OU using the OU Id
exports.getDepartmentsByOrgUnitId = async (req, res) => {
  try {
    const orgUnitId = req.body.id;
    const orgUnit = await OrganisationalUnit.find({ id: orgUnitId });
    let departments = [];
    if (orgUnit.length > 0) departments = orgUnit[0].departments;
    res.send(departments);
  } catch (error) {
    throw error;
  }
  // https://www.mongodb.com/docs/manual/reference/operator/query/ne/
};

// Get repos for a specific department belonging to an OU using the OU Id and department ID
exports.getOUDeptReposByIds = async (req, res) => {
  try {
    const orgUnitId = req.body.ouId;
    const deptId = req.body.deptId;

    const orgUnit = await OrganisationalUnit.find({
      id: orgUnitId,
    });
    let departments = orgUnit[0].departments;
    let department = departments.filter(
      (department) => department.id === deptId
    );
    deptRepo = department[0].repo;
    res.send(deptRepo);
  } catch (error) {
    throw error;
  }
  // https://www.mongodb.com/docs/manual/tutorial/query-embedded-documents/
  // https://www.mongodb.com/docs/manual/tutorial/query-array-of-documents/#std-label-array-match-embedded-documents
};

// Create an endpoint for viewing a division's credential repository.
// Be sure to verify the JWT and user permissions before providing access.
exports.getDeptRepoForUser = async (req, res) => {
  try {
    const orgUnitId = req.body.ouId;
    const deptId = req.body.deptId;
    //const userToken = req.body.userToken;
    const token = req.headers["authorization"].split(" ")[1];
    const orgUnit = await OrganisationalUnit.find({
      id: orgUnitId,
    });
    let departments = orgUnit[0].departments;
    let department = departments.filter(
      (department) => department.id === deptId
    );

    // check if user has access to the department repo

    const decoded = jwt.verify(token, "jwt-secret");

    if (
      decoded.role === "admin" ||
      decoded.departments.includes(department[0].id)
    ) {
      deptRepo = department[0].repo;
      console.log("deptRepo", deptRepo);
      res.send({ repo: deptRepo });
      // res.send({ msg: "Success!" });
    } else {
      // res.status(403).send({
      //   msg: "Your JWT was verified, but you do not have access to this resource.",
      // });
      res.status(403).send({
        repo: [
          {
            name: "Your JWT was verified ",
            url: "But you do not have access to this resource.",
            username: "Please contact your admin to get access to this repo.",
            password: "",
          },
        ],
        msg: "Your JWT was verified, but you do not have access to this resource. Please contact your admin to get access to this repo.",
      });
    }
  } catch (error) {
    res.sendStatus(401);
  }
};

exports.addNewCredentialsToDeptRepo = async (req, res) => {
  try {
    const orgUnitId = req.body.ouId;
    const deptId = req.body.deptId;
    const name = req.body.name;
    const url = req.body.url;
    const username = req.body.username;
    const password = req.body.password;
    const token = req.headers["authorization"].split(" ")[1];

    // verify the JWT and user permissions
    const decoded = jwt.verify(token, "jwt-secret");
    if (decoded.role === "admin" || decoded.departments.includes(deptId)) {
      const result = await OrganisationalUnit.updateOne(
        {
          id: orgUnitId,
        },
        {
          $push: {
            "departments.$[department].repo": {
              name: name,
              url: url,
              username: username,
              password: password,
            },
          },
        },
        { arrayFilters: [{ "department.id": { $eq: deptId } }] }
      );
      res.send({ msg: "The new entry has been added to the repo" });
    } else {
      res.status(403).send({
        msg: "Your JWT was verified, but you do not have access to this resource. Please contact your admin to get access to this repo.",
      });
    }
  } catch (error) {
    console.log("error", error);

    res.sendStatus(401);
  }
  // https://www.mongodb.com/docs/manual/reference/operator/update/push/
  // https://www.mongodb.com/docs/drivers/node/current/fundamentals/crud/write-operations/embedded-arrays/#:~:text=To%20update%20the%20first%20array,use%20the%20filtered%20positional%20operator.
  // https://www.mongodb.com/community/forums/t/updating-nested-array-of-objects-within-am-array-of-objects/246979
};

exports.editDeptRepoCredentials = async (req, res) => {
  try {
    console.log("in function");
    const orgUnitId = req.body.ouId;
    const deptId = req.body.deptId;
    const repoKey = req.body.repoKey;
    const name = req.body.name;
    const url = req.body.url;
    const username = req.body.username;
    const password = req.body.password;
    const token = req.headers["authorization"].split(" ")[1];

    // verify the JWT and user permissions
    const decoded = jwt.verify(token, "jwt-secret");
    if (
      decoded.role === "admin" ||
      (decoded.departments.includes(deptId) && decoded.role === "management")
    ) {
      console.log("inside if");
      const result = await OrganisationalUnit.updateOne(
        {
          id: orgUnitId,
        },
        {
          $set: {
            "departments.$[department].repo.$[credential]": {
              name: name,
              url: url,
              username: username,
              password: password,
            },
          },
        },
        {
          arrayFilters: [
            { "department.id": { $eq: deptId } },
            { "credential.name": { $eq: repoKey } },
          ],
        }
      );
      console.log("result", result);
      res.send({ msg: "The repo has been edited" });
    } else {
      console.log("inside 403");
      res.status(403).send({
        msg: "Your JWT was verified, but you do not have access to this resource. Please contact your admin to get access to this repo.",
      });
    }
  } catch (error) {
    console.log("inside 401");
    console.log("error", error);
    res.sendStatus(401);
  }
};
