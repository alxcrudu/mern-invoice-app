import { useContext, useEffect, useState } from "react";
import {
  Alert,
  Button,
  CircularProgress,
  Snackbar,
  TextField,
} from "@mui/material";
import { ThemeContext } from "../context/ThemeProvider";
import ProfilePictureUpload from "../components/ProfilePictureUpload";
import { AnimatePresence, motion } from "framer-motion";
import { ProfileContext } from "../context/ProfileProvider";
import { buttonStyles } from "../utils";
import Api from "../api";

export default function Settings() {
  const { profileData, setProfileData, loading, setLoading } =
    useContext(ProfileContext);
  const [inputs, setInputs] = useState(null);
  const [passInputs, setPassInputs] = useState(null);
  const [profileChanges, setProfileChanges] = useState(false);
  const [passwordChanges, setPasswordChanges] = useState(false);
  const [notification, setNotification] = useState({
    isOpen: false,
    vertical: "top",
    horizontal: "right",
    message: "",
    severity: "info",
    type: "",
    notificationLoading: "false",
  });
  const { theme } = useContext(ThemeContext);

  let {
    isOpen,
    vertical,
    horizontal,
    severity,
    message,
    type,
    notificationLoading,
  } = notification;

  const dismissNotification = () => {
    setNotification({ ...notification, isOpen: false });
  };

  useEffect(() => {
    setLoading(true);
    try {
      Api.getProfile().then((res) => {
        setInputs(res.data.userProfile);
        setProfileData(res.data.userProfile);
        setLoading(false);
      });
    } catch (error) {
      setLoading(false);
    }
  }, []);

  const handleProfileChange = (event) => {
    setProfileChanges(true);
    let { name, value } = event.target;
    setInputs({ ...inputs, [name]: value });
    if (inputs === profileData) {
      setProfileChanges(false);
    }
  };

  const handlePasswordChange = (event) => {
    setPasswordChanges(true);
    let { name, value } = event.target;
    setPassInputs({ ...passInputs, [name]: value });
  };

  const formStyles = {
    fontSize: ".9em",
    "& .MuiOutlinedInput-root": {
      fontFamily: "Spartan",
      fontSize: ".9em",
      color: theme === "dark" ? "white" : "black",
      "& fieldset": {
        fontFamily: "Spartan",
        fontSize: ".9em",
        borderColor:
          theme === "dark" ? "rgba(255,255,255,.3)" : "rgba(0,0,0,.15)",
      },
      "&:hover fieldset": {
        fontFamily: "Spartan",
        fontSize: ".9em",
        borderColor:
          theme === "dark" ? "rgba(255,255,255,.4)" : "rgba(0,0,0,.3)",
      },
      "&.Mui-focused fieldset": {
        fontFamily: "Spartan",
        fontSize: ".9em",
        borderColor:
          theme === "dark" ? "rgba(255,255,255,.4)" : "rgba(0,0,0,.3)",
      },
    },
    "& .MuiFormLabel-root": {
      fontFamily: "Spartan",
      fontSize: ".9em",
      color: theme === "dark" ? "white" : "black",
      "&.Mui-focused": {
        fontFamily: "Spartan",
        fontSize: ".9em",
        color: theme === "dark" ? "white" : "black",
      },
    },
  };

  const saveProfileChanges = () => {
    setNotification({
      ...notification,
      type: "profile",
      notificationLoading: true,
    });
    Api.editProfile(inputs)
      .then((res) => {
        setNotification({
          ...notification,
          type: "",
          isOpen: "true",
          notificationLoading: false,
          message: "Succesfully updated profile settings",
          severity: "success",
        });
        setProfileData(res.data.userProfile);
      })
      .catch((err) => {
        setNotification({
          ...notification,
          isOpen: true,
          message: err.response?.data?.message,
          severity: "error",
          type: "",
          notificationLoading: false,
        });
      });
  };

  const changePassword = () => {
    if (
      !passInputs.currentPassword ||
      !passInputs.newPassword ||
      !passInputs.confirmNewPassword
    )
      return setNotification({
        ...notification,
        isOpen: true,
        message: "Must complete all fields",
        severity: "warning",
      });
    if (passInputs.newPassword !== passInputs.confirmNewPassword)
      return setNotification({
        ...notification,
        isOpen: true,
        message: "New password doesn't match in both fields",
        severity: "error",
      });
    setNotification({
      ...notification,
      type: "password",
      notificationLoading: true,
    });
    Api.changePassword(passInputs.currentPassword, passInputs.newPassword)
      .then(() => {
        setNotification({
          ...notification,
          isOpen: true,
          message: "Succesfully changed password!",
          severity: "success",
          type: "",
          notificationLoading: false,
        });
      })
      .catch((err) => {
        setNotification({
          ...notification,
          isOpen: true,
          message: err.response?.data?.message,
          severity: "error",
          type: "",
          notificationLoading: false,
        });
      });
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ x: -400, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: 400, opacity: 0 }}
        transition={{ type: "tween" }}
        className="w-full min-h-screen flex flex-col items-center"
      >
        <div className="text-text dark:text-text-dark w-[750px]">
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
          <div className="mt-16">
            <ProfilePictureUpload />

            {loading ? (
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <CircularProgress
                  size={24}
                  style={{ color: "rgb(119,94,241)" }}
                />
              </div>
            ) : (
              <>
                <motion.div
                  initial={{ y: 50, opacity: 0, scale: "60%" }}
                  animate={{ y: 0, opacity: 1, scale: "100%" }}
                  exit={{ y: 50, opacity: 0, scale: "60%" }}
                  transition={{ type: "tween" }}
                >
                  <div className="mt-16 w-full flex flex-col gap-5 text-sm">
                    <h2>Billing details</h2>
                    <p className="text-xs text-text-sec dark:text-text-sec-dark mb-6">
                      Pre-complete your billing details so you don't have to
                      write them again each time you write an invoice
                    </p>
                    <div className="w-full grid grid-cols-3 gap-3">
                      {inputs && (
                        <>
                          <TextField
                            label="First name"
                            name="firstName"
                            value={inputs?.firstName || ""}
                            onChange={handleProfileChange}
                            id="outlined-basic"
                            variant="outlined"
                            size="medium"
                            sx={{ ...formStyles }}
                          />
                          <TextField
                            label="Last name"
                            name="lastName"
                            value={inputs?.lastName || ""}
                            onChange={handleProfileChange}
                            id="outlined-basic"
                            variant="outlined"
                            size="medium"
                            sx={{ ...formStyles }}
                          />
                          <TextField
                            label="Email"
                            name="email"
                            value={inputs?.email || ""}
                            onChange={handleProfileChange}
                            id="outlined-basic"
                            variant="outlined"
                            size="medium"
                            sx={{ ...formStyles }}
                          />
                        </>
                      )}
                    </div>
                    <TextField
                      label="Street Adress"
                      name="address"
                      value={inputs?.address || ""}
                      onChange={handleProfileChange}
                      id="outlined-basic"
                      variant="outlined"
                      size="medium"
                      fullWidth
                      sx={{ ...formStyles }}
                    />
                    <div className="w-full grid grid-cols-3 gap-3">
                      <TextField
                        label="City"
                        name="city"
                        value={inputs?.city || ""}
                        onChange={handleProfileChange}
                        id="outlined-basic"
                        variant="outlined"
                        size="medium"
                        sx={{ ...formStyles }}
                      />
                      <TextField
                        label="Postcode"
                        name="postcode"
                        value={inputs?.postcode || ""}
                        onChange={handleProfileChange}
                        id="outlined-basic"
                        variant="outlined"
                        size="medium"
                        sx={{ ...formStyles }}
                      />
                      <TextField
                        label="Country"
                        name="country"
                        value={inputs?.country || ""}
                        onChange={handleProfileChange}
                        id="outlined-basic"
                        variant="outlined"
                        size="medium"
                        sx={{ ...formStyles }}
                      />
                    </div>
                    <Button
                      variant="text"
                      disabled={!profileChanges}
                      onClick={saveProfileChanges}
                      sx={{
                        marginTop: "1em",
                        ...buttonStyles,
                        background: "rgba(128,136,191,.05)",
                        "&:hover": {
                          background: "rgba(128,136,191,.15)",
                        },
                        "&:disabled": {
                          color: "rgba(128,136,191,.30)",
                        },
                      }}
                    >
                      {notificationLoading && type === "profile" ? (
                        <CircularProgress
                          size="25px"
                          sx={{ color: "white", marginRight: "1em" }}
                        />
                      ) : (
                        <></>
                      )}
                      Save changes
                    </Button>
                  </div>
                  <div className="mt-10 mb-24 w-full flex flex-col gap-5 text-sm">
                    <h2>Change password</h2>
                    <TextField
                      label="Current password"
                      name="currentPassword"
                      value={passInputs?.currentPassword || ""}
                      onChange={handlePasswordChange}
                      type="password"
                      id="outlined-basic"
                      variant="outlined"
                      size="medium"
                      sx={{ ...formStyles }}
                    />
                    <TextField
                      label="New password"
                      name="newPassword"
                      value={passInputs?.newPassword || ""}
                      onChange={handlePasswordChange}
                      type="password"
                      id="outlined-basic"
                      variant="outlined"
                      size="medium"
                      sx={{ ...formStyles }}
                    />
                    <TextField
                      label="Confirm new password"
                      name="confirmNewPassword"
                      value={passInputs?.confirmNewPassword || ""}
                      onChange={handlePasswordChange}
                      type="password"
                      id="outlined-basic"
                      variant="outlined"
                      size="medium"
                      sx={{ ...formStyles }}
                    />
                    <Button
                      variant="text"
                      disabled={!passwordChanges}
                      onClick={changePassword}
                      sx={{
                        marginTop: "1em",
                        ...buttonStyles,
                        background: "rgba(128,136,191,.05)",
                        "&:hover": {
                          background: "rgba(128,136,191,.15)",
                        },
                        "&:disabled": {
                          color: "rgba(128,136,191,.30)",
                        },
                      }}
                    >
                      {notificationLoading && type === "password" ? (
                        <CircularProgress
                          size="25px"
                          sx={{ color: "white", marginRight: "1em" }}
                        />
                      ) : (
                        <></>
                      )}
                      Change password
                    </Button>
                  </div>
                </motion.div>
              </>
            )}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
