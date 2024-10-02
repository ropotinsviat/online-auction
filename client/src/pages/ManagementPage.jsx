import { useAuth } from "../AuthContext";
import { useNavigate } from "react-router-dom";
import { ReactComponent as AddLotIcon } from "../assets/svgs/add-lot.svg";
import { ReactComponent as AddAuctionIcon } from "../assets/svgs/add-auction.svg";
import { ReactComponent as UsersIcon } from "../assets/svgs/users.svg";
import { ReactComponent as AssigmentIcon } from "../assets/svgs/assigment.svg";
import "../assets/css/management.css";

export default function ManagementPage() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleNavigation = (e) => {
    const targetValue = e.currentTarget.getAttribute("value");
    navigate(`/${targetValue}`);
  };

  if (!user) return <></>;
  return (
    <div className="managements-wrapper">
      {(user.role === "admin" || user.role === "auctioneer") && (
        <>
          <div
            value="add/lot"
            className="management-card"
            onClick={handleNavigation}
          >
            <AddLotIcon />
            <div>Add lot</div>
          </div>
          <div
            value="add/auction"
            className="management-card"
            onClick={handleNavigation}
          >
            <AddAuctionIcon />
            <div>Add auction</div>
          </div>
          <div
            value="claims"
            className="management-card"
            onClick={handleNavigation}
          >
            <AssigmentIcon />
            <div>View claims</div>
          </div>
        </>
      )}
      {user.role === "admin" && (
        <div
          value="admin/users"
          className="management-card"
          onClick={handleNavigation}
        >
          <UsersIcon />
          <div>Manage users</div>
        </div>
      )}
    </div>
  );
}
