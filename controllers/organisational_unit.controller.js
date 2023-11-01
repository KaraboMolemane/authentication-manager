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
    // console.log('token', token)
    // console.log('decoded', decoded)
    // console.log("1", decoded.departments)
    // console.log("2", decoded.departments.includes(department[0].id))
    if (
      decoded.role === "admin" ||
      (decoded.departments && decoded.departments.includes(department[0].id))
    ) {
      deptRepo = department[0].repo;
      res.send({ repo: deptRepo });
      // res.send({ msg: "Success!" });
    } else {
      res.status(403).send({
        msg: "Your JWT was verified, but you do not have access to this resource. Please contact your admin to get access to this repo.",
      });
    }
  } catch (error) {
    console.log("error", error);
    res.sendStatus(401);
  }
};

exports.addNewCredentialsToDeptRepo = async (req, res) => {
  try {
    console.log("ADD - changes", req.body);
    const orgUnitId = req.body[0].ouId;
    const deptId = req.body[0].deptId;
    const name = req.body[0].data.name;
    const url = req.body[0].data.url;
    const username = req.body[0].data.username;
    const password = req.body[0].data.password;
    const token = req.headers["authorization"].split(" ")[1];

    // verify the JWT and user permissions
    const decoded = jwt.verify(token, "jwt-secret");
    if (
      decoded.role === "admin" ||
      (decoded.departments && decoded.departments.includes(deptId))
    ) {
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
      console.log("result", result);
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

exports.verifyTokenForAddingRepo = async (req, res) => {
  try {
    const token = req.headers["authorization"].split(" ")[1];
    const deptId = req.body.deptId;

    // verify the JWT and user permissions
    const decoded = jwt.verify(token, "jwt-secret");
    if (
      decoded.role === "admin" ||
      (decoded.departments && decoded.departments.includes(deptId))
    ) {
      res.send({ msg: "You have access to this resource." });
    } else {
      res.status(403).send({
        msg: "Your JWT was verified, but you do not have access to this resource. Any changes performed will not be saved.",
      });
    }
  } catch (error) {
    console.log("error", error);
    res.sendStatus(401);
  }
};

exports.editDeptRepoCredentials = async (req, res) => {
  try {
    const token = req.headers["authorization"].split(" ")[1];
    const decoded = jwt.verify(token, "jwt-secret");

    if (
      decoded.role === "admin" ||
      (decoded.role === "management" &&
        decoded.departments &&
        decoded.departments.includes(deptId))
    ) {
      // Get an array of changes from the body
      const changes = req.body;
      let result = null;
      if (changes.length !== 0) {
        changes.forEach(async (element, index) => {
          const dbRepo = await getRepoByName(
            element.ouId,
            element.deptId,
            element.key
          );
          // console.log("dbRepo", dbRepo);
          const repo = {
            name:
              element.data.name !== undefined ? element.data.name : dbRepo.name,
            url: element.data.url !== undefined ? element.data.url : dbRepo.url,
            username:
              element.data.username !== undefined
                ? element.data.username
                : dbRepo.username,
            password:
              element.data.password !== undefined
                ? element.data.password
                : dbRepo.password,
          };
          // console.log("repo", repo);

          const result = await OrganisationalUnit.updateOne(
            {
              id: element.ouId,
            },
            {
              $set: {
                "departments.$[dept].repo.$[r]": repo,
              },
            },
            {
              arrayFilters: [
                { "dept.id": { $eq: element.deptId } },
                { "r.name": { $eq: element.key } },
              ],
            }
          );
        });
        res.send({ msg: "The repo has been edited" });
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
  // https://www.mongodb.com/community/forums/t/findoneandupdate-clearing-values-in-nested-array/248860
};

async function getRepoByName(orgId, deptId, repoName) {
  try {
    let repo = null;
    const orgUnit = await OrganisationalUnit.findOne({
      id: orgId,
    });

    for (let i = 0; i < orgUnit.departments.length; i++) {
      const deptElement = orgUnit.departments[i];
      if (deptElement.id === deptId) {
        for (let j = 0; j < deptElement.repo.length; j++) {
          const repoElement = deptElement.repo[j];
          if (repoElement.name === repoName) {
            repo = repoElement;
            break;
          }
        }
        break;
      }
    }
    return repo;
  } catch (error) {
    throw error;
  }
}

exports.verifyTokenForEditingRepo = async (req, res) => {
  try {
    const token = req.headers["authorization"].split(" ")[1];
    const deptId = req.body.deptId;

    // verify the JWT and user permissions
    const decoded = jwt.verify(token, "jwt-secret");
    if (
      decoded.role === "admin" ||
      (decoded.role === "management" &&
        decoded.departments &&
        decoded.departments.includes(deptId))
    ) {
      res.send({ msg: "You have access to this resource." });
    } else {
      res.status(403).send({
        msg: "Your JWT was verified, but you do not have access to this resource. Any changes performed will not be saved.",
      });
    }
  } catch (error) {
    console.log("error", error);
    res.sendStatus(401);
  }
};

exports.editDeptEmployees = async (req, res) => {
  try {
    const token = req.headers["authorization"].split(" ")[1];
    const decoded = jwt.verify(token, "jwt-secret");
    if (decoded.role === "admin") {
      // Get an array of changes from the body
      const changes = req.body;
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
