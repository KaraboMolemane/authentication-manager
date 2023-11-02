import React from "react";
import { useCallback } from "react";

import "devextreme/dist/css/dx.light.css";

import { SelectBox } from "devextreme-react/select-box";

function UserSelectBox({ allUsers, handleUserSelection }) {
  const onValueChanged = useCallback(
    (e) => {
      const user = allUsers.filter((user) => {
        return user._id === e.value;
      });
      handleUserSelection(user);
    },
    [allUsers, handleUserSelection]
  );

  return (
    <SelectBox
      dataSource={allUsers}
      valueExpr="_id"
      displayExpr="username"
      onValueChanged={onValueChanged}
      label="User"
    ></SelectBox>
  );
}

export default UserSelectBox;

// https://supportcenter.devexpress.com/ticket/details/t401096/dxselectbox-how-to-show-more-that-one-value-in-the-displayexpr-property
// https://js.devexpress.com/React/Documentation/ApiReference/UI_Components/dxTagBox/Configuration/#displayExpr
