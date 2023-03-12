const express = require("express");
const router = express.Router();
require("dotenv").config();

router.post("/", (req, res) => {
  res.clearCookie("accessToken");
  res.clearCookie("refreshToken");

  res.sendStatus(200);
});

module.exports = router;
