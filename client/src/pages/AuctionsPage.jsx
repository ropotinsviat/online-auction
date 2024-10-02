import { useEffect, useState } from "react";
import "../assets/css/auctions.css";
import AuctionsCard from "../components/AuctionCard";
import Search from "../components/Search";
import api from "../api";
import { toast } from "react-toastify";

export default function AuctionsPage() {
  const [auctions, setAuctions] = useState([]);

  async function fetchAuctions(
    name = "",
    sort = 0,
    minCost = 1,
    maxCost = 100,
    date = 0
  ) {
    try {
      const res = await api.get("auctions", {
        params: { name, sort, minCost, maxCost, date },
      });

      setAuctions(res.data.auctions);
    } catch (e) {
      toast.error(e.response?.data?.message || "An error occurred");
    }
  }

  useEffect(() => {
    setAuctions([]);
    fetchAuctions();
  }, []);

  return (
    <div>
      <Search search={fetchAuctions} />
      <div className="auctions-wrapper">
        {auctions.map((a) => (
          <AuctionsCard
            key={a.auctionId}
            id={a.auctionId}
            name={a.auctionName}
            startAt={a.startTime}
            endTime={a.endTime}
            fee={a.entryCost}
            lotsAmount={a.lotsAmount}
            usersEnrolled={a.usersEnrolled}
            images={a.images}
          />
        ))}
      </div>
    </div>
  );
}
