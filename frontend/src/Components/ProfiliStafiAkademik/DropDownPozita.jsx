import React, { useState } from "react";
import "../Transkripta/Style.css";

const DropdownPozita = ({ defaultText = "Zgjedhe", items = [] }) => {
  const [selected, setSelected] = useState(defaultText);

  const handleSelect = (value) => {
    setSelected(value);
  };

  return (
    <div className="dropdown-center">
      <button
        className="btn btn-primary dropdown-toggle butoni-transkriptes"
        type="button"
        data-bs-toggle="dropdown"
        aria-expanded="false"
      >
        {selected}
      </button>
      <ul className="dropdown-menu">
        {items.map((item, index) => (
          <li key={index}>
            <button
              className="dropdown-item"
              onClick={() => handleSelect(item)}
            >
              {item}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DropdownPozita;
