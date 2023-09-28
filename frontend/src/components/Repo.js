import { useEffect, useState, useRef } from "react";
import "devextreme/dist/css/dx.light.css";
import DataGrid, {
  Column,
  Editing,
  Popup,
  Paging,
  MasterDetail,
  Lookup,
  Form,
  HeaderFilter,
  Search,
} from "devextreme-react/data-grid";
import "devextreme-react/text-area";
import { Item } from "devextreme-react/form";
import { customers } from "./data.js";
// import { OrgUnits } from "./data2.js";
import MasterDetailView from "./MasterDetailView.js";
import OrdersTab from "./OrdersTab.js";
// import DeptRepo from "./DeptRepo.js";
import DeptRepo from "./DeptRepoX.js";
import Header from "./Header.js";
import OrgUnitsSelect from "./OrgUnitsSelect.js";
import DepartmentSelectBox from "./DepartmentSelectBox.js";
import Cookies from "js-cookie";

function Repos() {
  //Declare states
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [token, setToken] = useState("");
  const [orgUnits, setOrgUnits] = useState([]);
  const [activeOrgUnit, setActiveOrgUnit] = useState({});
  const [activeDepartment, setActiveDepartment] = useState({});
  const [activeRepo, setActiveRepo] = useState([]);

  const queryString = window.location.search;
  const searchParams = new URLSearchParams(queryString);
  const userToken = useRef(searchParams.get("login"));
  console.log("userToken", userToken);

  useEffect(() => {
    // Get all Organisational Units
    fetch("/get-all-org-units")
      .then((res) => res.json())
      .then(
        (result) => {
          setIsLoaded(true);
          setOrgUnits(result);
        },
        (error) => {
          setIsLoaded(true);
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
      .then((res) => {
        console.log("Resource res", res);
        setActiveRepo(res.repo);
      });
  }

  function onSaving() {}

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
      <DataGrid
        dataSource={activeRepo}
        keyExpr="name"
        showBorders={true}
        //onSaving={onSaving}
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
          <Popup title="Repo" showTitle={true} width={700} height={255} />
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
