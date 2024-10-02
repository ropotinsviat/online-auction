import { useEffect, useState } from "react";
import { useAuth } from "../AuthContext";
import "../assets/css/auction.css";
import { useParams } from "react-router-dom";
import api from "../api";
import formatDate from "../utils/formatDate";
import { ReactComponent as ArrowDropDown } from "../assets/svgs/arrow_drop_down.svg";
import LotCard from "../components/LotCard";
import { toast } from "react-toastify";
import Timer from "../components/Timer";

export default function AuctionPage() {
  const { auctionId } = useParams();
  const [auction, setAuction] = useState({});
  const [showUsers, setShowUsers] = useState();
  const { user, setShowAuthMenu } = useAuth();

  useEffect(() => {
    (async function () {
      try {
        const res = await api.get(`auctions/${auctionId}`);
        console.log(res.data.auction);
        setAuction(res.data.auction);
      } catch (e) {
        toast.error(e.response?.data?.message || "An error occurred");
      }
    })();
  }, []);

  async function handleEnroll() {
    try {
      await api.post(`auctions/enroll/${auctionId}`);

      toast.success("You have enrolled!");
      setAuction((prev) => ({
        ...prev,
        users: [...prev.users, user],
      }));
    } catch (e) {
      toast.error(e.response?.data?.message || "An error occurred");
    }
  }

  return (
    <div className="auction-page-wrapper">
      <div className="auction-info">
        <div>
          {auction.startTime &&
            (new Date(auction.startTime) > new Date() ? (
              <div>
                <div>{formatDate(auction.startTime)}</div>
                <div>-</div>
                <div>{formatDate(auction.endTime)}</div>
              </div>
            ) : new Date(auction.endTime) > new Date() ? (
              <div>
                Closes in <Timer startTime={auction.endTime} />
              </div>
            ) : (
              <div>Auction is over</div>
            ))}

          <h2>{auction.auctionName}</h2>
        </div>
        {user ? (
          auction.users &&
          !auction.users.some((u) => u.userId === user.userId) ? (
            <input
              type="button"
              value={`Enroll ${auction.entryFee}$`}
              className="btn side-btn"
              onClick={handleEnroll}
            />
          ) : (
            <b>You are registered</b>
          )
        ) : (
          <input
            type="button"
            value="Sign up to bid"
            className="btn side-btn"
            onClick={() => setShowAuthMenu(true)}
          />
        )}
      </div>
      <div className="users-wrapper">
        <button onClick={() => setShowUsers((p) => !p)}>
          <b>{`Users enrolled: (${auction.users?.length})`}</b>
          <div>
            <ArrowDropDown
              className={`${showUsers ? "reverse" : ""} drp-dwn`}
            />
          </div>
        </button>
        {auction.users && (
          <div className={`users ${showUsers ? " show" : ""}`}>
            {auction.users.map((u, index) => (
              <div key={index} className="user">
                {index + 1}) {u.userName}
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="lots-list">
        {auction.lots &&
          auction.lots.map((l, index) => (
            <LotCard
              key={index}
              id={l.lotId}
              name={l.lotName}
              imageUrl={l.imageUrl}
              currentCost={l.currentCost}
            />
          ))}
      </div>
    </div>
  );
}
