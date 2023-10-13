import React from "react";
import { useCallback, useEffect, useState } from "react";

import "devextreme/dist/css/dx.light.css";

import { SelectBox } from "devextreme-react/select-box";

function UserSelectBox({
  allUsers,
  handleUserSelection
}) {

  const onValueChanged = useCallback((e) => {
    console.log("UserSelectBox e", e);

    const user = allUsers.filter(
      (user) => {
        console.log("UserSelectBox user.id", user.id);
        console.log("UserSelectBox e.value", e.value);
        return user.id === e.value
      }
    );
    console.log("UserSelectBox user", user);
    handleUserSelection(user);
  }, [allUsers, handleUserSelection ]);

  return (
    <SelectBox
      dataSource={allUsers}
      valueExpr="id"
      displayExpr="username"
      onValueChanged={onValueChanged}
      label="User"
    ></SelectBox>
  );
}

export default UserSelectBox;

// https://supportcenter.devexpress.com/ticket/details/t401096/dxselectbox-how-to-show-more-that-one-value-in-the-displayexpr-property
// https://js.devexpress.com/React/Documentation/ApiReference/UI_Components/dxTagBox/Configuration/#displayExpr
