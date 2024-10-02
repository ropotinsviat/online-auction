import React from "react";
import { useNavigate } from "react-router-dom";
import "../assets/css/auction-card.css";
import formatDate from "../utils/formatDate";

export default function AuctionCard({
  id,
  name,
  startAt,
  endTime,
  fee,
  lotsAmount,
  usersEnrolled,
  images,
}) {
  const navigate = useNavigate();
  function hangleClick() {
    navigate(`/auctions/${id}`);
  }

  const imagesArray =
    images && images.length ? images.split("|").slice(0, 2) : [];

  return (
    <div className="card">
      {new Date(startAt) < new Date() && <div className="ongoing">Active</div>}
      <ul className="image-container" onClick={hangleClick}>
        {imagesArray.map((src, index) => (
          <li key={index}>
            <img src={src} alt={`image-${index}`} />
          </li>
        ))}
      </ul>
      <div className="details">
        <h2 title={name} onClick={hangleClick} className="underline">
          {name}
        </h2>
        <div>Starts: {formatDate(startAt)}</div>
        <div>Ends: {formatDate(endTime)}</div>
        <div>Entry fee: {fee}$</div>
        <div>Items amount: {lotsAmount}</div>
        <div>Users enrolled: {usersEnrolled}</div>
      </div>
      <input
        type="button"
        className="btn side-btn"
        value="View auction"
        onClick={hangleClick}
      />
    </div>
  );
}
