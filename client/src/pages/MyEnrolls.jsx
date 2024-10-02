import { useEffect, useState } from "react";
import api from "../api";
import { useNavigate, useLocation } from "react-router-dom";
import formatDate from "../utils/formatDate";
import "../assets/css/enrolls.css";
import { toast } from "react-toastify";

export default function MyEnrolls() {
  const [auctions, setAuctions] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();

  function handleClick(auctionId) {
    navigate(`/auctions/${auctionId}`);
  }

  useEffect(() => {
    (async function () {
      try {
        const res = await api.get(location.pathname);
        setAuctions(res.data.auctions);
      } catch (e) {
        toast.error(e.response?.data?.message || "An error occurred");
      }
    })();
  }, []);

  return (
    <>
      {auctions.length ? (
        <div className="enrolls">
          <table>
            <thead>
              <tr>
                <th>Auction</th>
                <th>Starts</th>
                <th>Ends</th>
              </tr>
            </thead>
            <tbody>
              {auctions.map((a, index) => {
                return (
                  <tr
                    key={index}
                    onClick={() => handleClick(a.auctionId)}
                    className={index % 2 ? "white" : "grey"}
                  >
                    <td>{a.auctionName}</td>
                    {new Date(a.startTime) > new Date() ? (
                      <td>{formatDate(a.startTime)}</td>
                    ) : (
                      <td className="active">Active</td>
                    )}
                    <td>{formatDate(a.endTime)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="nothing">
          You haven't enrolled in any present auctions yet
        </div>
      )}
    </>
  );
}
