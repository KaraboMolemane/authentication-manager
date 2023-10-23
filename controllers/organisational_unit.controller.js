const OrganisationalUnit = require("../models/organisational_unit.model");
const jwt = require("jsonwebtoken");
const ObjectId = require("mongodb").ObjectId;

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
      res.send({ repo: deptRepo });
      // res.send({ msg: "Success!" });
    } else {
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
      if (result.modifiedCount && result.modifiedCount !== 0) {
        res.send({ msg: "The new entry has been added to the repo" });
      } else {
        res.send({
          msg: "Something went wrong while adding the new entry to the repo",
        });
      }
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
  // https://www.mongodb.com/docs/drivers/node/current/fundamentals/crud/write-operations/embedded-arrays/
  // https://www.mongodb.com/community/forums/t/updating-nested-array-of-objects-within-am-array-of-objects/246979
};

exports.editDeptRepoCredentials = async (req, res) => {
  try {
    const token = req.headers["authorization"].split(" ")[1];
    const decoded = jwt.verify(token, "jwt-secret");
    const result = null;
    if (decoded.role === "admin") {
      // Get an array of changes from the body
      const changes = req.body;
      console.log("changes", req.body);
      if (changes.length !== 0) {
        changes.forEach(async (element, index) => {
          const repo = {
            ouId: element.id,
            deptId: element.id,
            name: element.data.name,
            url: element.data.url,
            username: element.data.username,
            password: element.data.password,
          };
          const repoKey = element.key;
          return;
          const result = await OrganisationalUnit.updateOne(
            {
              id: orgUnitId,
            },
            {
              $set: {
                "departments.$[dept].repo.$[r]": changes,
              },
            },
            {
              arrayFilters: [
                { "dept.id": { $eq: deptId } },
                { "r.name": { $eq: repoKey } },
              ],
            }
          );
        });
        if (result.modifiedCount !== 0) {
          res.send({ msg: "The repo has been edited" });
        } else {
          res.send({
            msg: "Something went wrong while editing the entry to the repo",
          });
        }
      }
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

async function getRepoByName(orgId, deptId, repoName) {
  try {
    const repo = await OrganisationalUnit.findOne({
      id: orgId,
      "departments.id": deptId,
      "departments.repo.name": repoName,
    });
    return repo;
  } catch (error) {
    throw error;
  }
}

exports.editDeptEmployees = async (req, res) => {
  try {
    const token = req.headers["authorization"].split(" ")[1];
    const decoded = jwt.verify(token, "jwt-secret");
    if (decoded.role === "admin") {
      // Get an array of changes from the body
      const changes = req.body;
      console.log("changes", changes);
      let result = null;

      if (changes.length !== 0) {
        changes.forEach(async (element, index) => {
          const userId = element.userId;
          const userObjId = new ObjectId(userId);
          console.log("element.data.isEmployed", element.data.isEmployed);
          if (element.data.isEmployed === "true") {
            // Add element to array
            //  https://www.mongodb.com/docs/manual/reference/operator/update/push/
            console.log("element", element);
            result = await OrganisationalUnit.updateOne(
              {
                id: element.ouId,
              },
              {
                $push: {
                  "departments.$[department].employees": userObjId,
                },
              },
              { arrayFilters: [{ "department.id": { $eq: element.key } }] }
            );
            console.log("result", result);
          } else {
            // Remove element from array
            // https://www.mongodb.com/docs/manual/reference/operator/update/pull/#remove-items-from-an-array-of-documents
            const result = await OrganisationalUnit.updateOne(
              {
                id: element.ouId,
              },
              {
                $pull: {
                  "departments.$[department].employees": userObjId,
                },
              },
              { arrayFilters: [{ "department.id": { $eq: element.key } }] }
            );
            console.log("result", result);
          }
        });
      }
      res.send({ msg: "The department employees have been modified" });
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
