import React from "react";
import "./Error.css";

const Error = ({ message, onClose }) => {
  return (
    <div className="error">
      <p>{message}</p>
      <button onClick={onClose}>Close</button>
    </div>
  );
};

export default Error;
