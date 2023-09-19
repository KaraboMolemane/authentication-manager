import { useState, useEffect, useRef } from "react";
import "devextreme/dist/css/dx.light.css";
import DataGrid, {
  Column,
  Editing,
  Popup,
  Paging,
  Lookup,
  Form,
  HeaderFilter,
  Search,
} from "devextreme-react/data-grid";
import "devextreme-react/text-area";
import { Item } from "devextreme-react/form";
import { customers } from './data.js';
import { OrgUnits } from './data2.js';


function ReposTableView(){

    function onSaving(){

    }

    console.log('OrgUnits', OrgUnits)
    console.log('departments', OrgUnits.departments)
    console.log('repos', OrgUnits)

    return(
        <>
          <div id="data-grid-demo">
        <DataGrid
          dataSource={OrgUnits[0].departments[0].repo}
          keyExpr="name"
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
      </div>
        </>
    )
}

export default ReposTableView;