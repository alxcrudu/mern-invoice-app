import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  TextField,
  Button,
  Alert,
  Snackbar,
  CircularProgress,
} from "@mui/material";
import { logoSvg } from "../assets";
import { authFormStyles } from "../utils";
import Waves from "../components/Waves";
import Api from "../api";

export default function Signup() {
  const [inputs, setInputs] = useState({
    firstName: "",
    lastName: "",
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
  });
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
  let { firstName, lastName, email, username, password, confirmPassword } =
    inputs;

  const dismissNotification = () => {
    setNotification({ ...notification, isOpen: false });
  };

  const handleChange = (event) => {
    let { name, value } = event.target;
    setInputs({ ...inputs, [name]: value });
  };

  const handleSignup = async (e) => {
    try {
      e.preventDefault();
      if (email === "" || password === "" || confirmPassword === "")
        return setNotification({
          ...notification,
          isOpen: true,
          message: "Must complete all required fields (marked with star * )",
          severity: "warning",
        });
      if (password !== confirmPassword)
        return setNotification({
          ...notification,
          isOpen: true,
          message: "Passwords don't match",
          severity: "error",
        });
      await Api.signUp(username, password, email, firstName, lastName).then(
        () => {
          setNotification({
            ...notification,
            isOpen: true,
            message: "Signup successful!",
            severity: "success",
            loading: true,
          });
          setTimeout(() => {
            navigate("/");
            setNotification({
              ...notification,
              loading: false,
            });
          }, 500);
        }
      );
    } catch (err) {
      setNotification({
        ...notification,
        isOpen: true,
        message: err.response?.data?.message,
        severity: "error",
      });
    }
  };

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
      <div className="flex flex-col w-[550px] gap-6 items-center z-10 overflow-y-auto px-3 py-8">
        <div className="flex flex-col items-center gap-2">
          <img src={logoSvg} alt="Logo" />
          <h1 className="text-2xl">Signup</h1>
        </div>
        <form onSubmit={handleSignup} className="flex flex-col gap-3 w-full">
          <TextField
            label="Email *"
            name="email"
            // required
            value={inputs?.email || ""}
            onChange={handleChange}
            id="outlined-basic"
            variant="outlined"
            size="medium"
            sx={{ ...authFormStyles }}
          />
          <div className="flex gap-3">
            <TextField
              label="Username"
              name="username"
              value={inputs?.username || ""}
              onChange={handleChange}
              id="outlined-basic"
              variant="outlined"
              size="medium"
              sx={{ ...authFormStyles }}
            />
            <TextField
              label="First name"
              name="firstName"
              value={inputs?.firstName || ""}
              onChange={handleChange}
              id="outlined-basic"
              variant="outlined"
              size="medium"
              sx={{ ...authFormStyles }}
            />
            <TextField
              label="Last name"
              name="lastName"
              value={inputs?.lastName || ""}
              onChange={handleChange}
              id="outlined-basic"
              variant="outlined"
              size="medium"
              sx={{ ...authFormStyles }}
            />
          </div>
          <TextField
            label="Password *"
            name="password"
            type="password"
            // required
            value={inputs?.password || ""}
            onChange={handleChange}
            id="outlined-basic"
            variant="outlined"
            size="medium"
            sx={{ ...authFormStyles }}
          />
          <TextField
            label="Confirm password *"
            name="confirmPassword"
            type="password"
            // required
            value={inputs?.confirmPassword || ""}
            onChange={handleChange}
            id="outlined-basic"
            variant="outlined"
            size="medium"
            sx={{ ...authFormStyles }}
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
            {!loading && "Signup"}
          </Button>
        </form>
        <Link className="text-xs font-light" to="/login">
          Already have an account?{" "}
          <span className="font-medium">Login here</span>
        </Link>
      </div>
    </div>
  );
}
