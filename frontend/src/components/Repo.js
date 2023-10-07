import { useEffect, useState, useRef } from "react";
import "../App.css";
import "devextreme/dist/css/dx.light.css";
import DataGrid, {
  Column,
  Editing,
  Popup,
  Paging,
  Form,
  HeaderFilter,
  Search,
  Lookup,
} from "devextreme-react/data-grid";
import "devextreme-react/text-area";
import { Item } from "devextreme-react/form";
import Header from "./Header.js";
import OrgUnitsSelect from "./OrgUnitsSelect.js";
import DepartmentSelectBox from "./DepartmentSelectBox.js";

function Repo() {
  //Declare states
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  // const [token, setToken] = useState("");
  const [orgUnits, setOrgUnits] = useState([]);
  const [activeOrgUnit, setActiveOrgUnit] = useState({});
  const [activeDepartment, setActiveDepartment] = useState({});
  const [activeRepo, setActiveRepo] = useState([]);
  const [allusers, setAllUsers] = useState([]);

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

  function handleOrgUnitSelection(orgUnit) {
    setActiveOrgUnit(orgUnit);
    setActiveDepartment({});
    setActiveRepo([]);
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

  const getAllUsers = (e) => {
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

  }

  // let results = "Make selections above to view repo details.";
  // if (error) {
  //   results = error.message;
  // } else if (!isLoaded && !activeRepo) {
  //   results = "Loading...";
  // } else if(isLoaded){
  //   results = "Repo details:";
  // }

  const onSaving = (e) => {
    console.log("e:", e);

    const repos = e.changes;
    if (repos.length !== 0) {
      repos.array.forEach((element, index) => {
        const repo = {
          ouId: activeOrgUnit.id,
          deptId: activeDepartment.id,
          name: element.name,
          url: element.url,
          username: element.username,
          password: element.password,
        };

        if (e.changes[0].type === "update") {
          // EDIT existing repo
          // job.id = element.key ? element.key : editingModeID.current;
          repo.repoKey = element.name;

          fetch("/edit-dept-repo-credentials", {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + userToken.current,
            },
            body: JSON.stringify(repo),
          }).then(() => {
            console.log("Frontend - repo  credentials edited");
            // editingModeID.current = 0; //Reset editingMode,
          });
        } else {
          // ADD new repo
          fetch("/add-new-credentials-to-dept-repo", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + userToken.current,
            },
            body: JSON.stringify(repo),
          }).then(() => {
            console.log("Frontend - new repo credentials added");
          });
        }

        // window.location.href = "/";
      });
    }
  };

  return (
    <>
      <Header getAllUsers={getAllUsers}/>
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
        onSaving={onSaving}
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
      <article class="my-3" id="modal">
        <div>
          <div class="bd-example">
            <div class="d-flex justify-content-between flex-wrap">
              <button
                type="button"
                class="btn btn-primary"
                data-bs-toggle="modal"
                data-bs-target="#staticBackdropLive"
              >
                Edit user roles
              </button>
            </div>
          </div>
          <div
            class="modal fade"
            id="staticBackdropLive"
            data-bs-backdrop="static"
            data-bs-keyboard="false"
            tabindex="-1"
            aria-labelledby="staticBackdropLiveLabel"
            aria-hidden="true"
          >
            <div class="modal-dialog">
              <div class="modal-content">
                <div class="modal-header">
                  <h5 class="modal-title" id="staticBackdropLiveLabel">
                    Edit user roles
                  </h5>
                  <button
                    type="button"
                    class="btn-close"
                    data-bs-dismiss="modal"
                    aria-label="Close"
                  ></button>
                </div>
                <div class="modal-body">
                  <DataGrid
                    dataSource={allusers}
                    keyExpr="_id"
                    showBorders={true}
                    // onSaving={onSaving}
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
                <div class="modal-footer">
                  <button
                    type="button"
                    class="btn btn-secondary"
                    data-bs-dismiss="modal"
                  >
                    Close
                  </button>
                  <button type="button" class="btn btn-primary">
                    Understood
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </article>
    </>
  );
}

export default Repo;
