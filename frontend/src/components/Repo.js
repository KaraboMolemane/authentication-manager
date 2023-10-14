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
      Name: "true",
    },
    {
      ID: "false",
      Name: "false",
    },
  ]

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

  // const handleOrgUnitSelection = useCallback((e, orgUnit) => {
  //   setActiveOrgUnit(orgUnit);
  //   setActiveDepartment({});
  //   setActiveRepo([]);
  // }, []);

  function handleOrgUnitSelection(orgUnit) {
    setActiveOrgUnit(orgUnit);
    setActiveDepartment({});
    setActiveRepo([]);

    if (
      Object.keys(activeOrgUnit).length !== 0 &&
      Object.keys(activeUser).length !== 0
    ) {
      getuserPositions();
    }
  }

  // const  handleDepartmentSelection = useCallback((e, department) => {
  //   setActiveDepartment(department);
  //   //setActiveRepo(department[0].repo);
  //   console.log("department", department);

  //   fetch("/get-dept-repo-for-user", {
  //     method: "POST",
  //     headers: {
  //       "Content-Type": "application/json",
  //       Authorization: "Bearer " + userToken.current,
  //     },
  //     body: JSON.stringify({
  //       ouId: activeOrgUnit.id,
  //       deptId: department[0].id,
  //     }),
  //   })
  //     //.then((res) => console.log('res', res))
  //     .then((res) => res.json())
  //     .then(
  //       (res) => {
  //         console.log("Resource res", res);
  //         setIsLoaded(true);
  //         setActiveRepo(res.repo);
  //       },
  //       (error) => {
  //         setIsLoaded(true);
  //         setError(error);
  //       }
  //     );
  //   }, []);

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

  function getuserPositions() {
    // console.log("activeOrgUnit getuserPositions", activeOrgUnit);
    // console.log("activeUser getuserPositions", activeUser);
    const userPositionsArr = [];

    activeOrgUnit.departments.forEach((element) => {
      const userId = "ObjectId('" + activeUser._id + "')";
      const isEmployed = element.employees.includes(userId) ? true : false;
      const obj = {
        id: element.id,
        name: element.name,
        isEmployed: isEmployed,
      };
      userPositionsArr.push(obj);
    });
    // console.log("userPositionsArr", userPositionsArr);
    setUserPositions(userPositionsArr);
  }

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
    changes.ouId = activeOrgUnit.id;
    changes.deptId = activeDepartment[0].id;
    fetch("/edit-dept-repo-credentials", {
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
  }

  // const handleEditSaveRepo = useCallback((e) => {
  //   console.log("handleEditSaveRepo", e);

  // }, []);

  function handleEditSaveRepo(e) {
    console.log("handleEditSaveRepo", e);
    const repos = e.changes;
    if (repos.length !== 0) {
      repos.forEach((element, index) => {
        const repo = {
          ouId: activeOrgUnit.id,
          deptId: activeDepartment[0].id,
          name: element.data.name,
          url: element.data.url,
          username: element.data.username,
          password: element.data.password,
        };

        console.log("element", element);
        console.log("repo initial", repo);

        if (element.type === "update") {
          // EDIT existing repo
          repo.repoKey = element.key;
          console.log("repo update", repo);

          fetch("/edit-dept-repo-credentials", {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + userToken.current,
            },
            body: JSON.stringify(repo),
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
        } else {
          // ADD new repo
          fetch("/add-new-credentials-to-dept-repo", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + userToken.current,
            },
            body: JSON.stringify(repo),
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
        }

        // window.location.href = "/";
      });
    }
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

  const handleSavingUserPositions = useCallback((e) => {
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
                handleOrgUnitSelection={handleOrgUnitSelection}
                inModal={true}
              />
              <DataGrid
                dataSource={userPositions}
                keyExpr="id"
                showBorders={true}
                errorRowEnabled={false}
                onSaving={handleSavingUserPositions}
              >
                <Paging defaultPageSize={10} />
                <Editing mode="batch" allowUpdating={true} />
                <Column dataField="id" caption="Id" width={100} />
                <Column dataField="name" caption="department" />
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
