import { useEffect, useState } from "react";
import api from "../api";
import "../assets/css/orders.css";
import "../assets/css/enrolls.css";
import LotCard from "../components/LotCard";
import formatDate from "../utils/formatDate";
import OrderCard from "../components/OrderCard";
import { useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../AuthContext";
export default function MyOrdersPage() {
  const location = useLocation();
  const [orders, setOrders] = useState([]);

  async function fetchOrders() {
    try {
      const res = await api.get(location.pathname);
      setOrders(res.data.lots);
      console.log(res.data.lots);
    } catch (e) {
      toast.error(e.response?.data?.message || "An error occurred");
    }
  }

  useEffect(() => {
    fetchOrders();
  }, []);

  async function handlePay(bidId) {
    try {
      await api.post(`bids/${bidId}/pay`);
      await fetchOrders();
      toast.success("Successful payment!");
    } catch (e) {}
  }

  return (
    <>
      {orders.length ? (
        <div className="orders-wrapper">
          {orders.map((l, i) => (
            <OrderCard
              key={i}
              id={l.lotId}
              name={l.lotName}
              imageUrl={l.imageUrl}
              bidCost={l.bidCost}
              bidTime={l.bidTime}
              paymentTime={l.paymentTime}
              component={
                <div>
                  {l.sendingTime ? (
                    <b>Shipped at {formatDate(l.sendingTime)}</b>
                  ) : l.paymentTime ? (
                    <b>Awaiting shipment</b>
                  ) : (
                    <input
                      type="button"
                      value="Pay"
                      className="btn"
                      onClick={() => handlePay(l.bidId)}
                    />
                  )}
                </div>
              }
            />
          ))}
        </div>
      ) : (
        <div className="nothing">You haven't won any lots yet</div>
      )}
    </>
  );
}
