import { useEffect, useState } from "react";
import { useAuth } from "../AuthContext";
import "../assets/css/auction.css";
import { useParams } from "react-router-dom";
import api from "../api";
import formatDate from "../utils/formatDate";
import { ReactComponent as ArrowDropDown } from "../assets/svgs/arrow_drop_down.svg";
import LotCard from "../components/LotCard";
import { toast } from "react-toastify";
import { useNavigate, useLocation } from "react-router-dom";
import "../assets/css/lot-page.css";

export default function LotPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { auctionId } = useParams();
  const [lot, setLot] = useState({ categories: [], bids: [] });
  const { user, setShowAuthMenu } = useAuth();

  const [bid, setBid] = useState("");
  const [showBids, setShowBids] = useState();

  async function fetchLot() {
    try {
      const res = await api.get(location.pathname);
      setLot(res.data.lot);
      console.log(res.data.lot);
    } catch (e) {
      toast.error(e.response?.data?.message || "An error occurred");
    }
  }

  useEffect(() => {
    fetchLot();
  }, []);

  async function handleBid() {
    if (!bid) return toast.error("Enter sum to bid!");
    try {
      await api.post(`bids/add/${lot.lotId}`, { bidCost: bid });
      toast.success("Bid successful!");
      fetchLot();
    } catch (e) {
      toast.error(e.response?.data?.message || "An error occurred");
    }
  }

  return (
    <div className="lot-page-wrapper">
      <div className="lot-info">
        <h1>{lot.lotName}</h1>
        <div className="lot-img">
          <img src={lot.imageUrl} alt="Lot image" />
        </div>
        <div>{lot.description}</div>
        <div>
          Condition: <b>{lot.state}</b>
        </div>
        <div>
          Initial pcice: <b>$ {lot.startCost}</b>
        </div>
        <div className="categories">
          {lot.categories.map((category, i) => (
            <div key={i}>{category}</div>
          ))}
        </div>
      </div>
      <div className="bid-bar">
        <div>Current bid</div>
        <h2>$ {lot.currentCost}</h2>

        <div className="bid">
          <input
            value={bid}
            onChange={(e) => setBid(e.target.value)}
            type="number"
            placeholder={`$${lot.currentCost} or up`}
          />
          <input
            value={user ? "Bid" : "Sign up to bid"}
            type="button"
            className="btn"
            onClick={user ? handleBid : () => setShowAuthMenu(1)}
          />
        </div>

        <div className="auction-of-lot">
          Auction of the lot:{" "}
          <b
            className="underline"
            onClick={() => navigate(`/auctions/${lot.auctionId}`)}
          >
            {lot.auctionName}
          </b>
        </div>

        <button onClick={() => setShowBids((p) => !p)} className="dropdown-btn">
          {`See all bids: (${lot.bids.length})`}
          <div>
            <ArrowDropDown className={`${showBids ? "reverse" : ""} drp-dwn`} />
          </div>
        </button>
        {
          <div className={`bids ${showBids ? "show" : ""}`}>
            {lot.bids.map((b, i) => (
              <div className="bid-row" key={i}>
                <div className="userName">{b.userName}</div>
                <div className="bidCost">${Number(b.bidCost)}</div>
                <div className="bitTime"> {formatDate(b.bidTime)}</div>
              </div>
            ))}
          </div>
        }
      </div>
    </div>
  );
}
