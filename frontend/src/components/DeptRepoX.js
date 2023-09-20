import React from "react";
import { Form, Item, Label } from "devextreme-react/form";
import "devextreme/dist/css/dx.light.css";
// import DepartmentSelectBox from "./DepartmentSelectBox";
import DepartmentSelectBox from "./DepartmentSelectBoxX";
// import ReposTableView from "./ReposTableView";
import ReposTableView from "./ReposTableViewX";

class DeptRepo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      chosenDepartmentId: null,
    };
    this.departmentChanged = this.departmentChanged.bind(this);
    this.renderSelectBox = this.renderSelectBox.bind(this);
    this.renderReposTableView = this.renderReposTableView.bind(this);
  }

  render() {
    return (
      <Form labelLocation="top" className="form-container">
        <Item render={this.renderSelectBox}>
          {/* <Label text="Department" /> */}
        </Item>
        <Item render={this.renderReposTableView}>
          <Label text="Repos" />
        </Item>
      </Form>
    );
  }

  renderSelectBox() {
    return (
      <DepartmentSelectBox
        ouId={this.props.data.data.id}
        departmentId={this.state.chosenDepartmentId}
        onDepartmentChanged={this.departmentChanged}
      />
    );
  }

  renderReposTableView() {
    return (
      <ReposTableView
        ouId={this.props.data.data.id}
        departmentId={this.state.chosenDepartmentId}
      />
    );
  }

  departmentChanged(departmentId) {
    console.log('dept changed', departmentId)
    this.setState({
      chosenDepartmentId: departmentId,
    });
  }
}

export default DeptRepo;
