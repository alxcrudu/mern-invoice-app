const express = require("express");
const router = express.Router();
const User = require("../../../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

router.post("/", async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });

    if (!user) {
      return res
        .status(400)
        .send({ message: "Account with given username doesn't exist!" });
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (isPasswordMatch === false) {
      return res.status(401).send({ message: "Incorrect password!" });
    }

    const refreshToken = jwt.sign(
      { _id: user._id },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "48h" }
    );
    const accessToken = jwt.sign(
      { _id: user._id },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "15m" }
    );

    res.cookie("refreshToken", refreshToken, { httpOnly: true });
    res.cookie("accessToken", accessToken, { httpOnly: true });

    res.status(200).send({ message: "Login successful", accessToken });
  } catch (error) {
    res.status(500).send({ message: "Server error", error });
  }
});

module.exports = router;
