import { useEffect, useState } from "react";
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

function Repos() {
  //Declare states
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [orgUnits, setOrgUnits] = useState([]);

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

  function onSaving() {}

  return (
    <>
      <DataGrid
        dataSource={orgUnits}
        keyExpr="id"
        remoteOperations={true}
        showBorders={true}
        id="gridContainer"
      >
        <MasterDetail enabled={true} component={DeptRepo} />
        <Paging defaultPageSize={15} />
        <Column dataField="name" />
        <Column dataField="id" />
      </DataGrid>
    </>
  );
}

export default Repos;
