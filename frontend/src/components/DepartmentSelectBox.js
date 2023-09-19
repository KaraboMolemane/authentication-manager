import React from "react";
import { useCallback, useEffect, useState } from "react";

import "devextreme/dist/css/dx.light.css";

import { SelectBox } from "devextreme-react/select-box";

function DepartmentSelectBox(props) {

    //declare state(s)
    const [error, setError] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [items, setItems] = useState([]);


  const onValueChanged = useCallback((e) => {
    console.log(e.previousValue);
    console.log(e.value);
  }, []);

  const departmentDataDummy = [
    { id: "1001", name: "FinanceXXX" },
    { id: "1002", name: "ITXXX" },
    { id: "1003", name: "WritingXXXX" },
    { id: "1004", name: "DevelopmentXXX" },
    { id: "1005", name: "MarketingXXX" },
    { id: "1006", name: "SalesXXX" },
    { id: "1007", name: "HRXXX" },
    { id: "1008", name: "LegalXXX" },
    { id: "1009", name: "R&DXXX" },
    { id: "1010", name: "ProcumentXXX" },
  ];

  useEffect(() => {
    //Do the API call
    fetch("/get-depts-by-org-unit-id")
      .then((res) => res.json())
      .then(
        (result) => {
          setIsLoaded(true);
          console.log("Departments22:", result);
          setItems(result);
        },
        (error) => {
          setIsLoaded(true);
          console.log("error:", error);
          setError(error);
        }
      );
  }, []);


  return (
    <SelectBox
      dataSource={departmentDataDummy}
      valueExpr="id"
      displayExpr="name"
      onValueChanged={onValueChanged}
      label="Department"
    ></SelectBox>
  );
}

export default DepartmentSelectBox;
