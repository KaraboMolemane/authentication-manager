import { useEffect, useState, useRef, useCallback } from "react";
import "../App.css";
import DataGrid, {
  Column,
  Editing,
  Popup,
  Paging,
  HeaderFilter,
  Search,
  Lookup,
  Form,
} from "devextreme-react/data-grid";
import "devextreme-react/text-area";
import { Item } from "devextreme-react/form";
import Header from "./Header.js";
import OrgUnitsSelect from "./OrgUnitsSelect.js";
import DepartmentSelectBox from "./DepartmentSelectBox.js";
import UserSelectBox from "./UserSelectBox";

function Repo() {
  //Declare states
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [orgUnits, setOrgUnits] = useState([]);
  const [orgUnitReassign, setOrgUnitReassign] = useState({});
  const [activeOrgUnit, setActiveOrgUnit] = useState({});
  const [activeDepartment, setActiveDepartment] = useState({});
  const [activeRepo, setActiveRepo] = useState([]);
  const [activeUser, setActiveUser] = useState({});
  const [allUsers, setAllUsers] = useState([]);
  const [userPositions, setUserPositions] = useState([{}]);

  const cookies = document.cookie;
  const indexToken = cookies.indexOf("token=") + 6;
  const userToken = useRef(cookies.substring(indexToken));
  // console.log(userToken.current)
  const roles = [
    {
      ID: "normal",
      Name: "normal",
    },
    {
      ID: "management",
      Name: "management",
    },
    {
      ID: "admin",
      Name: "admin",
    },
  ];

  const isEmployed = [
    {
      ID: "true",
      Name: true,
    },
    {
      ID: "false",
      Name: false,
    },
  ];

  useEffect(() => {
    // Get all Organisational Units
    fetch("/get-all-org-units")
      .then((res) => res.json())
      .then(
        (result) => {
          // setIsLoaded(true);
          setOrgUnits(result);
        },
        (error) => {
          // setIsLoaded(true);
          setError(error);
        }
      );
  }, []);

  useEffect(() => {
    // Get user positions
    const userPositionsArr = [];
    if (
      Object.keys(orgUnitReassign).length > 0 &&
      Object.keys(activeUser).length > 0
    ) {
      orgUnitReassign.departments.forEach((element) => {
        const userId = activeUser._id;
        // console.log("dept name", element.name);
        // console.log("userId", userId);
        // console.log("userId", userId);
        // console.log("isEmployed", element.employees.includes(userId));
        // const isEmployedx = findObjectIdInEmployees(userId, element.employees)
        const isEmployed = element.employees.includes(userId) ? true : false;
        const obj = {
          ouId: orgUnitReassign.id,
          deptId: element.id,
          deptName: element.name,
          userId: userId,
          isEmployed: isEmployed,
        };
        userPositionsArr.push(obj);
      });
      // console.log("userPositionsArr", userPositionsArr);
      setUserPositions(userPositionsArr);
    }
  }, [orgUnitReassign, activeUser]);

  // const handleOrgUnitSelection = useCallback((e, orgUnit) => {
  //   setActiveOrgUnit(orgUnit);
  //   setActiveDepartment({});
  //   setActiveRepo([]);
  // }, []);

  function handleOrgUnitSelection(orgUnit) {
    setActiveOrgUnit(orgUnit);
    setActiveDepartment({});
    setActiveRepo([]);
  }

  function handleOrgUnitReassignSelection(orgUnit) {
    setOrgUnitReassign(orgUnit);
  }

  function handleDepartmentSelection(department) {
    setActiveDepartment(department);
    //setActiveRepo(department[0].repo);
    console.log("department", department);

    fetch("/get-dept-repo-for-user", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + userToken.current,
      },
      body: JSON.stringify({
        ouId: activeOrgUnit.id,
        deptId: department[0].id,
      }),
    })
      //.then((res) => console.log('res', res))
      .then((res) => res.json())
      .then(
        (res) => {
          console.log("Resource res", res);
          setIsLoaded(true);
          setActiveRepo(res.repo);
        },
        (error) => {
          setIsLoaded(true);
          setError(error);
        }
      );
  }

  function handleUserSelection(user) {
    setActiveUser(user[0]);
  }

  const getAllUsers = useCallback((e) => {
    fetch("/get-all-users")
      .then((res) => res.json())
      .then(
        (result) => {
          setAllUsers(result);
        },
        (error) => {
          console.log(error.msg);
        }
      );
  }, []);

  // let results = "Make selections above to view repo details.";
  // if (error) {
  //   results = error.message;
  // } else if (!isLoaded && !activeRepo) {
  //   results = "Loading...";
  // } else if(isLoaded){
  //   results = "Repo details:";
  // }

  function handleSavingRepo(e) {
    const changes = e.changes;
    console.log("changes", changes);
    changes.ouId = activeOrgUnit.id;
    changes.deptId = activeDepartment[0].id;

    if (e.changes[0].type === "update") {
      // // EDIT and existng repo
      // fetch("/edit-dept-repo-credentials", {
      //   method: "PUT",
      //   headers: {
      //     "Content-Type": "application/json",
      //     Authorization: "Bearer " + userToken.current,
      //   },
      //   body: JSON.stringify(changes),
      // })
      //   .then((res) => res.json())
      //   .then(
      //     (result) => {
      //       console.log(result.msg);
      //     },
      //     (error) => {
      //       console.log(error.msg);
      //     }
      //   );
    }
    else{
      // Add a new repo
      // fetch("/add-new-credentials-to-dept-repo", {
      //   method: "POST",
      //   headers: {
      //     "Content-Type": "application/json",
      //     Authorization: "Bearer " + userToken.current,
      //   },
      //   body: JSON.stringify(changes),
      // })
      //   .then((res) => res.json())
      //   .then(
      //     (result) => {
      //       console.log(result.msg);
      //     },
      //     (error) => {
      //       console.log(error.msg);
      //     }
      //   );
    }

    // https://stackoverflow.com/questions/56395941/how-do-i-send-an-array-with-fetch-javascript
  }

  const handleSavingUserRoles = useCallback((e) => {
    // console.log("handleSavingUserRoles:", e);
    const changes = e.changes;
    fetch("/edit-user-role", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + userToken.current,
      },
      body: JSON.stringify(changes),
    })
      .then((res) => res.json())
      .then(
        (result) => {
          console.log(result.msg);
        },
        (error) => {
          console.log(error.msg);
        }
      );

    // https://stackoverflow.com/questions/56395941/how-do-i-send-an-array-with-fetch-javascript
  }, []);

  const handleSavingUserPositions = useCallback(
    (e) => {
      console.log("handleSavingUserPositions:", e);
      const changes = e.changes;

      if (changes.length > 0) {
        changes.forEach((element) => {
          element.ouId = orgUnitReassign.id;
          element.userId = activeUser._id;
        });
      }

      // edit-dept-employees
      fetch("/edit-dept-employees", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + userToken.current,
        },
        body: JSON.stringify(changes),
      })
        .then((res) => res.json())
        .then(
          (result) => {
            console.log(result.msg);
          },
          (error) => {
            console.log(error.msg);
          }
        );

      // edit-user-positions
      fetch("/edit-user-positions", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + userToken.current,
        },
        body: JSON.stringify(changes),
      })
        .then((res) => res.json())
        .then(
          (result) => {
            console.log(result.msg);
          },
          (error) => {
            console.log(error.msg);
          }
        );

      // https://stackoverflow.com/questions/56395941/how-do-i-send-an-array-with-fetch-javascript
    },
    [activeUser._id, orgUnitReassign.id]
  );

  return (
    <>
      <Header getAllUsers={getAllUsers} />
      <fieldset className="mb-3">
        <legend>Make your selections to view a repo</legend>
        <OrgUnitsSelect
          orgUnits={orgUnits}
          handleOrgUnitSelection={handleOrgUnitSelection}
        />
        <div style={{ margin: "0 40% 0 40%" }}>
          <DepartmentSelectBox
            ouId={activeOrgUnit.id}
            departmentId={activeDepartment.id}
            handleDepartmentSelection={handleDepartmentSelection}
          />
        </div>
      </fieldset>
      {/* <p>{results}</p> */}
      <DataGrid
        dataSource={activeRepo}
        keyExpr="name"
        errorRowEnabled={false}
        showBorders={true}
        onSaving={handleSavingRepo}
      >
        <Paging defaultPageSize={10} />
        <HeaderFilter visible={true}>
          <Search enabled={true} />
        </HeaderFilter>
        <Editing
          mode="popup"
          allowUpdating={true}
          allowAdding={true}
          allowDeleting={false}
        >
          <Popup title="Repo Info" showTitle={true} width={700} height={255} />
          <Form>
            <Item itemType="group" colCount={2} colSpan={2}>
              <Item dataField="name" />
              <Item dataField="url" />
              <Item dataField="username" />
              <Item dataField="password" />
            </Item>
          </Form>
        </Editing>
        {/* <Column dataField="_id" caption="Id" width={70} /> */}
        <Column dataField="name" width={170} />
        <Column dataField="url" />
        <Column dataField="username" />
        <Column dataField="password" />
      </DataGrid>
      {/* Modal for editing user roles */}
      <div>
        <div
          className="modal fade"
          id="staticBackdropLive"
          data-bs-backdrop="static"
          data-bs-keyboard="false"
          tabIndex="-1"
          aria-labelledby="staticBackdropLiveLabel"
          aria-hidden="true"
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="staticBackdropLiveLabel">
                  Edit user roles
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                ></button>
              </div>
              <div className="modal-body">
                <DataGrid
                  dataSource={allUsers}
                  keyExpr="_id"
                  showBorders={true}
                  onSaving={handleSavingUserRoles}
                >
                  <Paging defaultPageSize={10} />
                  <Editing mode="batch" allowUpdating={true} />
                  <Column dataField="_id" caption="Id" />
                  <Column dataField="firstname" />
                  <Column dataField="lastname" />
                  <Column dataField="username" />
                  <Column dataField="role">
                    <Lookup
                      dataSource={roles}
                      displayExpr="Name"
                      valueExpr="ID"
                    />
                  </Column>
                </DataGrid>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  data-bs-dismiss="modal"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Modal for reassigning users */}
      <div
        className="modal fade"
        id="staticBackdropLive2"
        data-bs-backdrop="static"
        data-bs-keyboard="false"
        tabIndex="-1"
        aria-labelledby="staticBackdropLiveLabel2"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="staticBackdropLiveLabel2">
                Reassign user positions
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <h6>
                Make the relevant selections below to assign user to
                organisational unit/department
              </h6>
              <UserSelectBox
                allUsers={allUsers}
                handleUserSelection={handleUserSelection}
              />{" "}
              <br></br>
              <OrgUnitsSelect
                orgUnits={orgUnits}
                handleOrgUnitSelection={handleOrgUnitReassignSelection}
                inModal={true}
              />
              <DataGrid
                dataSource={userPositions}
                keyExpr="deptId"
                showBorders={true}
                errorRowEnabled={false}
                onSaving={handleSavingUserPositions}
              >
                <Paging defaultPageSize={10} />
                <Editing mode="batch" allowUpdating={true} />
                <Column dataField="deptId" caption="deptId" width={100} />
                <Column dataField="deptName" caption="department" />
                <Column dataField="isEmployed">
                  <Lookup
                    dataSource={isEmployed}
                    displayExpr="Name"
                    valueExpr="ID"
                  />
                </Column>
              </DataGrid>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Repo;
