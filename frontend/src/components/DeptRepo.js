import React, { useState } from "react";
import "devextreme/dist/css/dx.light.css";
import DepartmentSelectBox from "./DepartmentSelectBox";
import ReposTableView from "./ReposTableView";

import { Form } from "devextreme-react/form";
import { Item, Label } from "devextreme-react/data-grid";

function DeptRepo(props) {
  const [chosenDepartmentID, setChosenDepartmentID] = useState("");

  console.log('DeptRepo OrgUnits', props.OrgUnits)

  const renderSelectBox = () => {
    return (
      <DepartmentSelectBox
        OUId={props.OrgUnits.id}
        departmentId={chosenDepartmentID}
        onProducChanged={productChanged}
      />
    );
  };

  const renderReposTableview = () => {
    return <ReposTableView />;
  };

  const productChanged = (departmentId) => {
    setChosenDepartmentID(departmentId);
  };

  return (
    <div className="App">
      <Form labelLocation="top" className="form-container">
        <Item render={renderSelectBox} />
        <Item render={renderReposTableview}>
          <Label text="Repos" />
        </Item>
      </Form>
    </div>
  );
};

export default DeptRepo;
