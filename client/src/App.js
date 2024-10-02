import { Route, Routes } from "react-router-dom";
import AuctionsPage from "./pages/AuctionsPage";
import AuctionPage from "./pages/AuctionPage";
import LotPage from "./pages/LotPage";
import ProfilePage from "./pages/ProfilePage";
import MyEnrolls from "./pages/MyEnrolls";
import MyOrdersPage from "./pages/MyOrdersPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import Header from "./components/Header";
import AddLotPage from "./pages/AddLotPage";
import AddAuctionPage from "./pages/AddAuctionPage";
import ClaimsPage from "./pages/ClaimsPage";
import AdminPage from "./pages/AdminPage";
import ManagementPage from "./pages/ManagementPage";
import { ToastContainer } from "react-toastify";
import "./assets/css/app.css";
import "react-toastify/dist/ReactToastify.css";

export default function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<AuctionsPage />} />
        <Route path="/auctions" element={<AuctionsPage />} />
        <Route path="/auctions/:auctionId" element={<AuctionPage />} />
        <Route path="/lots/:lotId" element={<LotPage />} />
        <Route path="/users/:userId/auctions" element={<MyEnrolls />} />
        <Route path="/users/:userId/lots" element={<MyOrdersPage />} />
        <Route path="/user" element={<ProfilePage />} />
        <Route path="/management" element={<ManagementPage />} />
        <Route path="/admin/users" element={<AdminPage />} />
        <Route path="/claims" element={<ClaimsPage />} />
        <Route
          path="/reset-password/:resetLink"
          element={<ResetPasswordPage />}
        />
        <Route path="/add/lot" element={<AddLotPage />} />
        <Route path="/add/auction" element={<AddAuctionPage />} />
      </Routes>
      <ToastContainer autoClose={2000} />
    </>
  );
}
