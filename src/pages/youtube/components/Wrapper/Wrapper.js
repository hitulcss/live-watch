import React from "react";
import "./Wrapper.css";

const Wrapper = ({ children }) => {
  return (
    <>
      <div className="contentWrapper">{children}</div>
    </>
  );
};

export default Wrapper;
