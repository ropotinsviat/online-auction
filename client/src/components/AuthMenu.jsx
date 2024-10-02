import "../assets/css/auth.css";
import { useState, useEffect } from "react";
import api from "../api";
import { useAuth } from "../AuthContext";
import { toast } from "react-toastify";
import { ReactComponent as CloseIcon } from "../assets/svgs/close.svg";

export default function AuthMenu() {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");

  const { fetchUserData, setShowAuthMenu } = useAuth();
  const close = () => setShowAuthMenu(false);

  const toggleForm = () => setIsLogin((prev) => !prev);

  const handleResetPassword = async () => {
    try {
      if (!email) return toast.error("Enter your e-mail!");
      await api.post("users/password-reset-link", { email });
      toast.success("Check your e-mail!");
    } catch (e) {
      toast.error(e.response?.data?.message || "An error occurred");
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await api.post("users/signin", { nameOrEmail: email, password });
      await fetchUserData();
      close();
    } catch (e) {
      toast.error(e.response?.data?.message || "An error occurred");
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      await api.post("users/signup", { username, email, password });
      toast.success("Check your e-mail!");
    } catch (e) {
      toast.error(e.response?.data?.message || "An error occurred");
    }
  };

  return (
    <div className="container-wrapper">
      <div className="container">
        <CloseIcon className="close-auth" onClick={close} />
        <input
          type="checkbox"
          id="check"
          checked={!isLogin}
          onChange={toggleForm}
        />
        <div className={`login form ${isLogin ? "" : "hidden"}`}>
          <h2>Login</h2>
          <form onSubmit={handleLogin}>
            <input
              type="text"
              placeholder="Name or e-mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <label onClick={handleResetPassword}>Forgot password?</label>
            <input type="submit" className="button" value="Login" />
          </form>
          <div className="signup">
            <span className="signup">
              {"Don't have an account? "}
              <label htmlFor="check">Signup</label>
            </span>
          </div>
        </div>
        <div className={`registration form ${isLogin ? "hidden" : ""}`}>
          <h2>Signup</h2>
          <form onSubmit={handleSignup}>
            <input
              type="text"
              placeholder="E-mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <input type="submit" className="button" value="Signup" />
          </form>
          <div className="signup">
            <span className="signup">
              {"Already have an account? "}
              <label htmlFor="check">Login</label>
            </span>
          </div>
        </div>
      </div>
      <div id="full-overlay" onClick={close}></div>
    </div>
  );
}
