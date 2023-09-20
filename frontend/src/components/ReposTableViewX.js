import React from "react";

import {
  Column,
  DataGrid,
  Paging,
  Editing,
  Popup,
  Form,
  HeaderFilter,
  Search,
} from "devextreme-react/data-grid";
import { Item } from "devextreme-react/form";
import { createStore } from "devextreme-aspnet-data-nojquery";

// const url =
//   "https://js.devexpress.com/Demos/Mvc/api/DataGridAdvancedMasterDetailView";

class ReposTableView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      departmentRepoStore: null,
    };
    console.log("TabLe view X", props);
  }

  render() {
    return (
      <DataGrid
        dataSource={this.state.orderHistoryStore}
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
    );
  }

  componentDidUpdate(prevProps) {
    const { departmentId } = this.props;
    if (prevProps.departmentId !== departmentId) {
      // this.setState({
      //   departmentRepoStore: createStore({
      //     key: "OrderID",
      //     loadParams: { ProductID: departmentId },
      //     loadUrl: `${url}/GetOrdersByProduct`,
      //   }),
      // });
    }
  }
}

export default ReposTableView;
