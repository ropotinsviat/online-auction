import { useEffect, useState } from "react";
import api from "../api";
import { toast } from "react-toastify";
import OrderCard from "../components/OrderCard";

export default function ClaimsPage() {
  const [claims, setClaims] = useState([]);

  async function fetchClaims() {
    try {
      const res = await api.get("claims");
      setClaims(res.data.claims);
      console.log(res.data.claims);
    } catch (e) {
      toast.error(e.response?.data?.message || "An error occurred");
    }
  }

  useEffect(() => {
    fetchClaims();
  }, []);

  async function handleMarkAsSend(paymentId) {
    if (window.confirm("Are you sure you want to continue?"))
      try {
        await api.post(`claims/${paymentId}/send`);
        fetchClaims();
      } catch (e) {
        toast.error(e.response?.data?.message || "An error occurred");
      }
  }
  async function handleDeleteBid(bidId) {
    if (window.confirm("Are you sure you want to continue?"))
      try {
        await api.delete(`bids/${bidId}`);
        fetchClaims();
      } catch (e) {
        toast.error(e.response?.data?.message || "An error occurred");
      }
  }

  return (
    <div>
      <div className="orders-wrapper">
        {claims.map((c, i) => (
          <OrderCard
            key={i}
            id={c.lotId}
            name={c.lotName}
            imageUrl={c.imageUrl}
            bidTime={c.bidTime}
            bidCost={c.bidCost}
            paymentTime={c.paymentTime}
            user={{
              userName: c.userName,
              email: c.email,
              phone: c.phone,
              address: c.address,
            }}
            component={
              <div>
                <input
                  type="button"
                  value={c.paymentTime ? "Mark as shipped" : "Delete bid"}
                  className="btn"
                  onClick={
                    c.paymentTime
                      ? () => handleMarkAsSend(c.paymentId)
                      : () => handleDeleteBid(c.bidId)
                  }
                />
              </div>
            }
          />
        ))}
      </div>
    </div>
  );
}
