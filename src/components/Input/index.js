import React from "react";
import "./style.css";

const Input = ({ label, state, setState, placeholder }) => {
  return (
    <div className="input-wrapper">
      <p className="label-input">{label}</p>
      <input
        value={state}
        placeholder={placeholder}
        onChange={(e) => setState(e.target.value)}
        className="custom-input"
      />
    </div>
  );
};

export default Input;
