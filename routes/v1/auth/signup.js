const express = require("express");
const router = express.Router();
const Profile = require("../../../models/Profile");
const bcrypt = require("bcryptjs");
const User = require("../../../models/User");
require("dotenv").config();

router.post("/", async (req, res) => {
  try {
    const { username, password, email, firstName, lastName } = req.body;

    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(409).json({
        message: "User already exists",
      });
    }

    let hasUsername;
    if (username === "") {
      hasUsername = email;
    }

    const saltRounds = 12;
    const salt = bcrypt.genSaltSync(saltRounds);
    const encryptedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      username: hasUsername,
      password: encryptedPassword,
    });
    await newUser.save();

    const newProfile = new Profile({
      firstName: firstName || "",
      lastName: lastName || "",
      email: email || "",
      address: "",
      city: "",
      postcode: "",
      country: "",
      profilePicture: "",
      userId: newUser._id,
    });

    await newProfile.save();

    res.status(200).json({ message: "Signup Successful!" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
