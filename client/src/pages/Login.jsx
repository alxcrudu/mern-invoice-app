import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  TextField,
  Button,
  Alert,
  Snackbar,
  CircularProgress,
} from "@mui/material";
import { logoSvg } from "../assets";
import Waves from "../components/Waves";
import { authFormStyles } from "../utils";
import Api from "../api";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [notification, setNotification] = useState({
    isOpen: false,
    vertical: "top",
    horizontal: "right",
    message: "",
    severity: "info",
    loading: false,
  });
  const navigate = useNavigate();

  let { isOpen, vertical, horizontal, severity, message, loading } =
    notification;

  const dismissNotification = () => {
    setNotification({ ...notification, isOpen: false });
  };

  const handleLogin = async (e) => {
    try {
      e.preventDefault();
      if (username === "" || password === "")
        return setNotification({
          ...notification,
          isOpen: true,
          message: "Must complete all fields",
          severity: "warning",
        });
      await Api.logIn(username, password).then(() => {
        localStorage.setItem("isAuthenticated", true);
        setNotification({
          ...notification,
          isOpen: true,
          message: "Login successful!",
          severity: "success",
          loading: true,
        });
        setTimeout(() => {
          setNotification({
            ...notification,
            loading: false,
          });
          navigate("/home");
        }, 500);
      });
    } catch (err) {
      setNotification({
        ...notification,
        isOpen: true,
        message: err.response?.data?.message,
        severity: "error",
      });
    }
  };

  useEffect(() => {
    if(localStorage.getItem("isAuthenticated")) {
      navigate("/home");
    }
  }, [])
  

  return (
    <div className="flex flex-col justify-center items-center bg-[rgb(158,146,242)] h-screen text-text-dark">
      <Snackbar
        autoHideDuration={5000}
        anchorOrigin={{ vertical, horizontal }}
        open={isOpen}
        onClose={dismissNotification}
        message="I love snacks"
        key={vertical + horizontal}
      >
        <Alert
          onClose={dismissNotification}
          severity={severity}
          sx={{ fontSize: ".75em", display: "flex", alignItems: "center" }}
        >
          {message}
        </Alert>
      </Snackbar>
      <Waves />
      <div className="flex flex-col w-96 gap-6 items-center z-10 overflow-y-auto px-3 py-8">
        <div className="flex flex-col items-center gap-2">
          <img src={logoSvg} alt="Logo" />
          <h1 className="text-2xl">Login</h1>
        </div>
        <form onSubmit={handleLogin} className="flex flex-col gap-3 w-full">
          <TextField
            label="Username / email"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            sx={{
              ...authFormStyles,
            }}
          />
          <TextField
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            sx={{
              ...authFormStyles,
            }}
          />
          <Button
            type="submit"
            disabled={loading}
            sx={{
              background: "rgb(119,94,241)",
              color: "white",
              height: "50px",
              "&:disabled": {
                background: "rgba(119,94,241,.3)",
              },
            }}
          >
            {loading && (
              <CircularProgress size="25px" sx={{ color: "white" }} />
            )}
            {!loading && "Login"}
          </Button>
        </form>
        <Link className="text-xs font-light" to="/signup">
          Don't have an account?{" "}
          <span className="font-medium">Signup here</span>
        </Link>
      </div>
    </div>
  );
}
