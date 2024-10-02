import { useState, useEffect } from "react";
import api from "../api";
import "../assets/css/add.css";
import { toast } from "react-toastify";

export default function AddAuction() {
  const [name, setName] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [entryFee, setEntryFee] = useState("");

  const [possibleLots, setPossibleLots] = useState([]);
  const [selectedLots, setSelectedLots] = useState([]);

  useEffect(() => {
    (async function () {
      try {
        const res = await api.get("/lots/available");
        setPossibleLots(res.data.lots);
        console.log(res.data.lots);
      } catch (e) {
        toast.error(e.response?.data?.message || "An error occurred");
      }
    })();
  }, []);

  const handleLotSelect = (lotId, checked) => {
    setSelectedLots((prevSelectedLots) => {
      if (checked) return [...prevSelectedLots, { lotId, startingPrice: 0 }];
      return prevSelectedLots.filter((lot) => lot.lotId !== lotId);
    });
  };

  const handleStartingPriceChange = (lotId, startingPrice) => {
    setSelectedLots((prevSelectedLots) =>
      prevSelectedLots.map((lot) =>
        lot.lotId === lotId
          ? { ...lot, startingPrice: parseFloat(startingPrice) || 0 }
          : lot
      )
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/auctions/add", {
        name,
        startTime,
        endTime,
        entryFee,
        lots: selectedLots,
      });
      toast.success("Auction created successfully!");
    } catch (e) {
      toast.error(e.response?.data?.message || "An error occurred");
    }
  };

  return (
    <form className="add" onSubmit={handleSubmit}>
      <div className="name-state-description">
        <input
          type="text"
          placeholder="Auction Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <div className="time-fee">
          <input
            type="datetime-local"
            placeholder="Start Time"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            min={getMinDateTime()}
            required
          />
          <input
            type="datetime-local"
            placeholder="End Time"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            min={getMinDateTime()}
            required
          />
          <input
            type="number"
            placeholder="Entry Fee"
            value={entryFee}
            onChange={(e) => setEntryFee(e.target.value)}
            min="0"
            step="0.01"
            required
          />
        </div>
      </div>

      <div className="lots-selection">
        <h3>Select Lots and Set Starting Price</h3>
        {possibleLots.map((lot) => (
          <div key={lot.lotId} className="lot-item">
            <label>
              <input
                type="checkbox"
                value={lot.lotId}
                onChange={(e) => handleLotSelect(lot.lotId, e.target.checked)}
              />
              {lot.lotName} ({lot.state})
            </label>
            <input
              type="number"
              placeholder="Starting Price"
              min="0"
              step="0.01"
              value={
                selectedLots.find((selected) => selected.lotId === lot.lotId)
                  ?.startingPrice || ""
              }
              onChange={(e) =>
                handleStartingPriceChange(lot.lotId, e.target.value)
              }
              disabled={
                !selectedLots.some((selected) => selected.lotId === lot.lotId)
              }
              required={selectedLots.some(
                (selected) => selected.lotId === lot.lotId
              )}
            />
          </div>
        ))}
      </div>

      <button type="submit" className="btn">
        Create Auction
      </button>
    </form>
  );
}
function getMinDateTime() {
  const now = new Date();
  now.setDate(now.getDate() + 1);

  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");

  return `${year}-${month}-${day}T${hours}:${minutes}`;
}
