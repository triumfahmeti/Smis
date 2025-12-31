import React, { useState } from "react";
import "../Transkripta/Style.css";

const DropdownLigjeruesi = ({
  defaultText = "",

  items = [],
  selected = null,
  onChange,
}) => {
  // const [selected, setSelected] = useState(null);

  const handleSelect = (item) => {
    // setSelected(item);
    console.log("Dropdown selected item:", item);
    if (onChange) onChange(item);
  };

  return (
    <div className="dropdown-center">
      <button
        className="btn btn-primary dropdown-toggle butoni-transkriptes"
        type="button"
        data-bs-toggle="dropdown"
        aria-expanded="false"
      >
        {selected ? selected.label : defaultText}
      </button>
      <ul className="dropdown-menu">
        {items.map((item, index) => (
          <li key={index}>
            <button
              className="dropdown-item"
              onClick={() => handleSelect(item)}
            >
              {item.label ?? item}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DropdownLigjeruesi;
