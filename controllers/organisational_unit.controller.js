const OrganisationalUnit = require("../models/organisational_unit.model");

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
