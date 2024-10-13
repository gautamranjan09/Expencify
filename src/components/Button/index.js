import React from "react";
import "./style.css";

const Button = ({ text, onClick, blue }) => {
  return (
    <div className={blue ? "btn btn-blue" : "btn"} onClick={onClick}>
      {text}
    </div>
  );
};

export default Button;
