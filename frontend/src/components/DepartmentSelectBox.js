import React from "react";
import { useCallback, useEffect, useState } from "react";

import "devextreme/dist/css/dx.light.css";

import { SelectBox } from "devextreme-react/select-box";

function DepartmentSelectBox({
  ouId,
  departmentId,
  handleDepartmentSelection
}) {

    //declare state(s)
    const [error, setError] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [departments, setDepartments] = useState([]);


  const onValueChanged = useCallback((e) => {
    const department = departments.filter(
      (department) => department.id === e.value
    );
    handleDepartmentSelection(department);
  }, [departments, handleDepartmentSelection]);

  useEffect(() => {

    const orgID = {id: ouId}
    // console.log('orgID', orgID);
    fetch("/get-depts-by-org-unit-id", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(orgID),
    })
      .then((res) => res.json())
      .then((res) => {
        console.log("res", res);
        setDepartments(res);
      });

  }, [ouId]);


  return (
    <SelectBox
      dataSource={departments}
      valueExpr="id"
      displayExpr="name"
      onValueChanged={onValueChanged}
      label="Department"
    ></SelectBox>
  );
}

export default DepartmentSelectBox;
