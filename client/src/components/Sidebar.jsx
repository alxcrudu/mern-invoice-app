import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { ThemeContext } from "../context/ThemeProvider";
import GridViewRoundedIcon from "@mui/icons-material/GridViewRounded";
import SettingsIcon from "@mui/icons-material/Settings";
import LogoutIcon from "@mui/icons-material/Logout";
import ReceiptIcon from "@mui/icons-material/Receipt";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";
import { logoPng } from "../assets";
import { ProfileContext } from "../context/ProfileProvider";
import { avatarRender } from "../utils";
import Api from "../api";

export default function Sidebar() {
  const { theme, toggleTheme } = useContext(ThemeContext);
  const { profilePicture, profileData } = useContext(ProfileContext);
  const navigate = useNavigate();

  const logOut = () => {
    Api.logOut().then(() => {
      localStorage.removeItem("isAuthenticated");
      navigate("/");
    });
  };

  return (
    <div className="w-[6rem] h-screen fixed bg-sidebar rounded-tr-3xl rounded-br-3xl z-50 flex flex-col justify-between">
      <div className="flex flex-col items-center gap-6">
        <img src={logoPng} alt="Sidebar Logo" />
        <button className="sidebar-btn" onClick={() => navigate("/dashboard")}>
          <GridViewRoundedIcon />
        </button>
        <button className="sidebar-btn" onClick={() => navigate("/home")}>
          <ReceiptIcon />
        </button>
        <button className="sidebar-btn" onClick={() => navigate("/settings")}>
          <SettingsIcon />
        </button>
      </div>
      <div className="flex flex-col items-center gap-6 mb-6">
        <button onClick={toggleTheme} className="sidebar-btn">
          {theme === "dark" ? <LightModeIcon /> : <DarkModeIcon />}
        </button>
        <div className="divider"></div>
        <button className="sidebar-btn" onClick={() => logOut()}>
          <LogoutIcon sx={{ fontSize: "1.3rem" }} />
        </button>
        {avatarRender(
          profilePicture,
          profileData?.firstName,
          profileData?.lastName,
          40
        )}
      </div>
    </div>
  );
}
