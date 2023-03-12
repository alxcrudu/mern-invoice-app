const express = require("express");
const router = express.Router();
const User = require("../../../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

router.post("/", async (req, res) => {
  try {
    const token = req.cookies.accessToken;
    const newPassword = req.body.newPassword;
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const userId = decoded._id;
    const user = await User.findOne({ _id: userId });

    const isPasswordMatch = await bcrypt.compare(
      req.body.currentPassword,
      user.password
    );
    if (!isPasswordMatch) {
      return res.status(401).send({ message: "Incorrect current password!" });
    }

    const saltRounds = 10;
    const salt = bcrypt.genSaltSync(saltRounds);
    const encryptedPassword = await bcrypt.hash(newPassword, salt);

    await User.findOneAndUpdate(
      { _id: userId },
      { password: encryptedPassword },
      { new: true }
    );

    res.status(200).send({ message: "Password successfully changed!" });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Server error", error });
  }
});

module.exports = router;
