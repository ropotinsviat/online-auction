import { useState, useEffect } from "react";
import api from "../api";
import "../assets/css/add.css";
import { ReactComponent as SearchIcon } from "../assets/svgs/search.svg";
import { useAuth } from "../AuthContext";
import { toast } from "react-toastify";

export default function AdminPage() {
  const [roles, setRoles] = useState(["user", "admin", "auctioneer"]);
  const [users, setUsers] = useState([]);
  const [nameOrEmail, setNameOrEmail] = useState("");
  const { user: me } = useAuth();

  async function handleSearch() {
    try {
      const res = await api.get("users/", { params: { nameOrEmail } });
      setUsers(res.data.users);
      console.log(res.data.users);
    } catch (e) {
      toast.error(e.response?.data?.message || "An error occurred");
    }
  }
  function handleKeyDown(e) {
    e.key === "Enter" && handleSearch();
  }
  async function handleRoleChange(user, role) {
    if (me.userId === user.userId)
      if (!window.confirm("Are you sure you want to change your own role?"))
        return;
    try {
      await api.post(`/users/${user.userId}/set-role/${role}`);
      setUsers((p) =>
        p.map((u) => (u.userId === user.userId ? { ...u, role } : u))
      );
    } catch (e) {
      toast.error(e.response?.data?.message || "An error occurred");
    }
  }

  return (
    <div>
      <div className="auction-search">
        <div id="search-wrapper">
          <div className="search-bar">
            <input
              type="text"
              placeholder="Enter name of email"
              value={nameOrEmail}
              onChange={(e) => setNameOrEmail(e.target.value)}
              onKeyDown={handleKeyDown}
            />
          </div>
          <SearchIcon id="search" onClick={handleSearch} />
        </div>
      </div>
      <div className="user-management">
        <div className="user-list">
          <div className="user-item">
            <div>
              <b>Name</b>
            </div>
            <div>
              <b>Email</b>
            </div>
            <div>
              <b>Phone</b>
            </div>
            <div>
              <b>Role</b>
            </div>
          </div>
          {users.map((user, index) => (
            <div
              key={index}
              className={`user-item ${index % 2 ? "white" : "grey"}`}
            >
              <div>{user.name}</div>
              <div>{user.email}</div>
              <div>{user.phone}</div>
              <div>
                <select
                  value={user.role}
                  onChange={(e) => handleRoleChange(user, e.target.value)}
                >
                  {roles.map((role, roleIndex) => (
                    <option key={roleIndex} value={role}>
                      {role}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
