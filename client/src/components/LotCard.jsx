import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../assets/css/lot-card.css";

export default function LotCard({ id, imageUrl, name, currentCost }) {
  const navigate = useNavigate();
  const goToLotPage = () => navigate(`/lots/${id}`);

  return (
    <div className="lot-card">
      <div className="lot-img" onClick={goToLotPage}>
        <img src={imageUrl} alt="Lot image" />
      </div>
      <div className="lot-card-content">
        <h4 onClick={goToLotPage} className="underline">
          {name}
        </h4>
        <div className="current-cost">Current cost: {currentCost}$</div>
      </div>
    </div>
  );
}
