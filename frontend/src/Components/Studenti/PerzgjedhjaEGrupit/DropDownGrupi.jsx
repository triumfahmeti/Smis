import React from "react";
import "../Transkripta/Style.css";

const DropDownGrupi = ({
  defaultText = "Zgjedh grupin",
  items = [],
  selected = null,
  onChange,
}) => {
  const handleSelect = (item) => {
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
        {selected?.label || defaultText}
      </button>
      <ul className="dropdown-menu">
        {items.length > 0 ? (
          items.map((item, index) => (
            <li key={index}>
              <button
                className="dropdown-item"
                onClick={() => handleSelect(item)}
              >
                {item.label ?? item}
              </button>
            </li>
          ))
        ) : (
          <li>
            <span className="dropdown-item disabled">Nuk ka të dhëna</span>
          </li>
        )}
      </ul>
    </div>
  );
};

export default DropDownGrupi;
