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
import { customers } from './data.js';
import { OrgUnits } from './data2.js';
import MasterDetailView from "./MasterDetailView.js";
import OrdersTab from "./OrdersTab.js";
// import DeptRepo from "./DeptRepo.js";
import DeptRepo from "./DeptRepoX.js";


function Repos(){

    function onSaving(){

    }

    console.log('App OrgUnits', OrgUnits[0]);
    console.log('App departments', OrgUnits[0].departments);

    return (
        <>
      <DataGrid
        dataSource={OrgUnits}
        keyExpr='id'
        remoteOperations={true}
        showBorders={true}
        id="gridContainer"
      >
        <MasterDetail
          enabled={true}
          component={DeptRepo}
        />
        <Paging defaultPageSize={15} />
        <Column dataField="name" />
        <Column dataField="id" />
      </DataGrid>
        </>
    )
}

export default Repos;