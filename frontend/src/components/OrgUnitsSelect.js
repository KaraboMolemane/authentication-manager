function OrgUnitsSelect({ orgUnits, handleOrgUnitSelection, inModal }) {

  //const orgUnits = props.orgUnits;
  const orgUnitItems = orgUnits.map((orgUnit) => (
    <li className={inModal ? "" : "list-inline-item"} key={orgUnit.id}>
      <input
        type="radio"
        name="radios"
        className="form-check-input"
        id={orgUnit.id}
        onClick={() => handleOrgUnitSelection(orgUnit)}
      />
      <label className="form-check-label" htmlFor={orgUnit.id}>
        &nbsp;{orgUnit.name}
      </label>
    </li>
  ));

  return (
    <ul className={inModal ? "list-unstyled text-start" : "list-inline"}>
      {orgUnitItems}
    </ul>
  );
}

export default OrgUnitsSelect;
