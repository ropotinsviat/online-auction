import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "../assets/css/lot-card.css";
import formatDate from "../utils/formatDate";

export default function OrderCard({
  id,
  name,
  imageUrl,
  bidCost,
  bidTime,
  component,
  user,
  paymentTime,
}) {
  const navigate = useNavigate();

  return (
    <div className="order-card">
      <div className="lot-img">
        <img src={imageUrl} alt="Lot" />
      </div>
      <div className="lot-data-wrapper">
        <h2 className="underline" onClick={() => navigate(`/lots/${id}`)}>
          {name}
        </h2>
        <div className="order-details">
          <div>
            Bid amount: <b>{bidCost}$</b>
          </div>
          <div>Bided at: {formatDate(bidTime)}</div>
          {paymentTime && <div>Payed at: {formatDate(paymentTime)}</div>}
        </div>
        {user && (
          <>
            <div className="order-details">
              <div>{user.userName}</div>
              <div>{user.phone}</div>
              <div>{user.email}</div>
            </div>
            <div className="order-details">
              <div>{user.address}</div>
            </div>
          </>
        )}
      </div>
      {component}
    </div>
  );
}
