import React from "react";
import "./Card.css"

function Card({day , icon, min_t , max_t}) {
  return (
    <div className="text-white w-40 flex flex-col items-center rounded-lg py-4" style={{ background: '#004AAD', }}>
      <h3 className="text-xl font-bold">{day}</h3>
      {icon}
      <p className="font-bold">{min_t} - {max_t}</p>
    </div>
  );
}

export default Card;
