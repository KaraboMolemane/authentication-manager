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
} from "devextreme-react/data-grid";
import "devextreme-react/text-area";
import { Item } from "devextreme-react/form";
import Header from "./Header.js";
import OrgUnitsSelect from "./OrgUnitsSelect.js";
import DepartmentSelectBox from "./DepartmentSelectBox.js";

function Repos() {
  //Declare states
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  // const [token, setToken] = useState("");
  const [orgUnits, setOrgUnits] = useState([]);
  const [activeOrgUnit, setActiveOrgUnit] = useState({});
  const [activeDepartment, setActiveDepartment] = useState({});
  const [activeRepo, setActiveRepo] = useState([]);

  // const queryString = window.location.search;
  // const searchParams = new URLSearchParams(queryString);
  // // const userToken = useRef(searchParams.get("login"));
  const cookies = document.cookie;
  const indexToken = cookies.indexOf("token=") + 6;
  const userToken = useRef(cookies.substring(indexToken));
  // console.log(userToken.current)

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
  }

  return (
    <>
      <Header />
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
        <Column dataField="_id" caption="Id" width={70} />
        <Column dataField="name" width={170} />
        <Column dataField="url" />
        <Column dataField="username" />
        <Column dataField="password" />
      </DataGrid>
    </>
  );
}

export default Repos;
