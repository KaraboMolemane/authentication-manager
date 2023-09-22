import { useEffect, useState } from "react";

function OrgUnitsSelect({
    orgUnits,
    handleOrgUnitSelection
}) {
  // const [error, setError] = useState(null);
  // const [isLoaded, setIsLoaded] = useState(false);
  // const [orgUnits, setOrgUnits] = useState([]);

  //const orgUnits = props.orgUnits;
  const orgUnitItems = orgUnits.map((orgUnit) => (
    <li className="list-inline-item" key={orgUnit.id}>
      <input
        type="radio"
        name="radios"
        className="form-check-input"
        id={orgUnit.id}
        onClick={()=> handleOrgUnitSelection(orgUnit)}
      />
      <label className="form-check-label" htmlFor={orgUnit.id}>
      &nbsp;{orgUnit.name}
      </label>
    </li>
  ));

  return (
    <ul className="list-inline">{orgUnitItems}</ul>
  )
}

export default OrgUnitsSelect;