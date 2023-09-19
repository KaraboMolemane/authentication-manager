import React from 'react';
import { SelectBox } from 'devextreme-react/select-box';
import { createStore } from 'devextreme-aspnet-data-nojquery';

const url = 'https://js.devexpress.com/Demos/Mvc/api/DataGridAdvancedMasterDetailView';
const departmentLabel = { 'aria-label': 'Department' };

class DepartmentSelectBox extends React.Component {
  constructor(props) {
    super(props);
    this.state = {xData: null};

    const orgID = {id: props.ouId}
    console.log('orgID', orgID);
    fetch("/get-depts-by-org-unit-id", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(orgID),
    })
      .then((res) => res.json())
      .then((res) => {
        console.log("res", res);
        this.departmentsData = res;
        this.setState({
          xData: res
        });
      });

    // this.departmentsData = createStore({
    //   key: 'id',
    //   loadParams: { SupplierID: this.props.ouId },
    //   loadUrl: `${url}/GetProductsBySupplier`,
    //   onLoaded: this.setDefaultValue.bind(this),
    // });

    this.valueChanged = this.valueChanged.bind(this);
  }

  render() {
    return (
      <SelectBox
        value={this.props.departmentId}
        deferRendering={false}
        inputAttr={departmentLabel}
        dataSource={this.state.xData}
        valueExpr="id"
        displayExpr="name"
        onValueChanged={this.valueChanged}
      />
    );
  }

  setDefaultValue(items) {
    const firstItem = items[0];
    if (firstItem && this.props.departmentId === null) {
      this.props.onDepartmentChanged(firstItem.id);
    }
  }

  valueChanged(e) {
    this.props.onDepartmentChanged(e.value);
  }
}

export default DepartmentSelectBox;
