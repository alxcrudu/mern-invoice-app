const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/verifyToken");

const signupRouter = require("./v1/auth/signup");
const loginRouter = require("./v1/auth/login");
const logoutRouter = require("./v1/auth/logout");
const refreshTokenRouter = require("./v1/auth/refresh-token");
const changePasswordRouter = require("./v1/auth/change-password");
const invoicesRouter = require("./v1/invoices");
const profileRouter = require("./v1/profile");

router.use("/signup", signupRouter);
router.use("/login", loginRouter);
router.use("/logout", logoutRouter);
router.use("/refresh-token", refreshTokenRouter);
router.use("/change-password", changePasswordRouter);
router.use("/invoices", verifyToken, invoicesRouter);
router.use("/profile", verifyToken, profileRouter);

module.exports = router;
