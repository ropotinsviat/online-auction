import { useEffect, useState } from "react";
import { useAuth } from "../AuthContext";
import "../assets/css/profile.css";
import { ReactComponent as PenIcon } from "../assets/svgs/edit.svg";
import { ReactComponent as CheckIcon } from "../assets/svgs/check.svg";
import { ReactComponent as LogoutIcon } from "../assets/svgs/logout.svg";
import { useNavigate } from "react-router-dom";
import api from "../api";
import { toast } from "react-toastify";

export default function ProfilePage() {
  const navigate = useNavigate();
  const { user, fetchUserData } = useAuth();

  const [edit, setEdit] = useState();
  const [name, setName] = useState(user?.userName || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [address, setAddress] = useState(user?.address || "");

  async function handleLogout() {
    if (window.confirm("Are you sure you want to log out?"))
      try {
        await api.post("users/logout");
        await fetchUserData();
        navigate("/");
      } catch (e) {
        toast.error(e.response?.data?.message || "An error occurred");
      }
  }

  async function handleClick() {
    if (edit)
      try {
        if (
          user.userName === name &&
          user.phone === phone &&
          user.address === address
        )
          return setEdit();
        await api.post("users/profile", { name, phone, address });
        await fetchUserData();
        toast.success("Info changed!");
        setEdit();
      } catch (e) {
        toast.error(e.response?.data?.message || "An error occurred");
      }
    else setEdit(true);
  }

  return (
    <div className="profile">
      <div>
        <div onClick={handleClick}>{edit ? <CheckIcon /> : <PenIcon />}</div>
        <div>
          <div>Email:</div>
          <div>
            <input value={user?.email} readOnly />
          </div>
        </div>
        <div>
          <div>Name:</div>
          <div className={edit && "edible"}>
            <input
              readOnly={!edit}
              value={name}
              type="text"
              onChange={(e) => setName(e.target.value)}
            />
          </div>
        </div>
        <div>
          <div>Phone:</div>
          <div className={edit && "edible"}>
            <input
              readOnly={!edit}
              value={phone}
              type="text"
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>
        </div>
        <div>
          <div>Address:</div>
          <div className={edit && "edible"}>
            <input
              readOnly={!edit}
              value={address}
              type="text"
              onChange={(e) => setAddress(e.target.value)}
            />
          </div>
        </div>
        <div>
          <div id="logout" onClick={handleLogout}>
            <LogoutIcon /> Logout
          </div>
        </div>
      </div>
    </div>
  );
}
