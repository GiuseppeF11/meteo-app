import React from "react";
import "./Loader.css"

const Loader = () => (
  <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-60">
    <div className="loader"></div>
  </div>
);

export default Loader;
