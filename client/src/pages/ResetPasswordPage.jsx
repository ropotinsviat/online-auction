import "../assets/css/auth.css";
import { useState } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";

export default function ResetPasswordPage() {
  const navigate = useNavigate();

  const { resetLink } = useParams();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  async function handleReset(e) {
    e.preventDefault();
    if (password != confirmPassword)
      return toast.error("Confirm your new password!");
    try {
      await api.post("users/reset-password", { token: resetLink, password });
      toast.success("Password has been reseted!");
      setTimeout(() => {
        navigate("/");
      }, 2000);
    } catch (e) {
      toast.error(e.response?.data?.message || "An error occurred");
    }
  }

  return (
    <div className="container-wrapper">
      <div className="container">
        <div className="login form">
          <h2>Reset password</h2>
          <form onSubmit={handleReset}>
            <input
              type="password"
              placeholder="Enter your new password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <input
              type="password"
              placeholder="Confirm your new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <label onClick={() => navigate("/auctions")}>Back</label>
            <input type="submit" className="button" value="Submit" />
          </form>
        </div>
      </div>
    </div>
  );
}
