import { useAuth } from "../AuthContext";
import "../assets/css/header.css";
import { useLocation, useNavigate } from "react-router-dom";
import { ReactComponent as MenuIcon } from "../assets/svgs/menu.svg";
import { ReactComponent as GavelIcon } from "../assets/svgs/gavel.svg";
import { ReactComponent as EnrollIcon } from "../assets/svgs/enroll.svg";
import { ReactComponent as ProfileIcon } from "../assets/svgs/profile.svg";
import { ReactComponent as OrderIcon } from "../assets/svgs/order.svg";
import { ReactComponent as LoginIcon } from "../assets/svgs/login.svg";
import { ReactComponent as HammerIcon } from "../assets/svgs/hammer.svg";
import { ReactComponent as EmployeeIcon } from "../assets/svgs/admin.svg";
import { useState } from "react";

export default function Header() {
  const navigate = useNavigate();
  const { user, setShowAuthMenu } = useAuth();

  const [showCurtains, setShowCurtains] = useState();

  const handleNavigation = (e) => {
    setShowCurtains(false);
    const targetValue = e.currentTarget.getAttribute("value");
    navigate(`/${targetValue}`);
  };

  return (
    <>
      <header>
        <div id="hamburger" onClick={() => setShowCurtains((p) => !p)}>
          <MenuIcon />
        </div>
        <div id="logo">
          <HammerIcon />
          <div className="text">
            <div>Online</div>
            <div>Auction</div>
          </div>
        </div>

        <nav>
          <div value="auctions" onClick={handleNavigation}>
            <GavelIcon /> Auctions
          </div>
          {user ? (
            <>
              <div
                value={`users/${user.userId}/auctions`}
                onClick={handleNavigation}
              >
                <EnrollIcon /> My Enrolls
              </div>
              <div
                value={`users/${user.userId}/lots`}
                onClick={handleNavigation}
              >
                <OrderIcon />
                My Orders
              </div>
              <div value="user" onClick={handleNavigation}>
                <ProfileIcon />
                Profile
              </div>
              {(user.role === "admin" || user.role === "auctioneer") && (
                <div value="management" onClick={handleNavigation} type="nav">
                  <EmployeeIcon />
                  Management
                </div>
              )}
            </>
          ) : (
            <div value="auth" onClick={() => setShowAuthMenu(true)}>
              <LoginIcon /> Login
            </div>
          )}
        </nav>
      </header>
      <div className={`curtains ${showCurtains ? "show-curtains" : ""}`}>
        <div className="hamburger-logo">
          <div id="hamburger" onClick={() => setShowCurtains((p) => !p)}>
            <MenuIcon />
          </div>
          <div id="logo">
            <HammerIcon />
            <div className="text">
              <div>Online</div>
              <div>Auction</div>
            </div>
          </div>
        </div>
        <div value="auctions" onClick={handleNavigation} type="nav">
          <GavelIcon /> Auctions
        </div>
        {user ? (
          <>
            <div
              value={`users/${user.userId}/auctions`}
              onClick={handleNavigation}
              type="nav"
            >
              <EnrollIcon /> My Enrolls
            </div>
            <div
              value={`users/${user.userId}/lots`}
              onClick={handleNavigation}
              type="nav"
            >
              <OrderIcon /> My Orders
            </div>
            <div value="user" onClick={handleNavigation} type="nav">
              <ProfileIcon />
              Profile
            </div>
            {(user.role === "admin" || user.role === "auctioneer") && (
              <div value="management" onClick={handleNavigation} type="nav">
                <EmployeeIcon />
                Management
              </div>
            )}
          </>
        ) : (
          <div value="auth" onClick={() => setShowAuthMenu(true)} type="nav">
            <LoginIcon /> Login
          </div>
        )}
      </div>
      <div
        id={showCurtains ? "overlay" : ""}
        onClick={() => setShowCurtains(false)}
      ></div>
      <div id="header-place-compensator"></div>
    </>
  );
}
