const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const Profile = require("../../models/Profile");
dotenv.config();

router.post("/upload-picture", async (req, res) => {
  try {
    const token = req.cookies.accessToken;
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const userId = decoded._id;

    await Profile.findOneAndUpdate(
      { userId: userId },
      { profilePicture: req.body.profilePicture },
      { new: true }
    );

    res.status(200).json({ message: "Profile picture updated successfully." });
  } catch (error) {
    res.status(500).json({ message: "Error updating profile picture", error });
  }
});

router.get("/get-profile", async (req, res) => {
  try {
    const token = req.cookies.accessToken;
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const userId = decoded._id;

    const userProfile = await Profile.findOne({ userId: userId });

    res.status(200).json({ userProfile });
  } catch (error) {
    res.status(500).json({ message: "Could not retrieve profile", error });
  }
});

router.post("/edit-profile", async (req, res) => {
  try {
    const token = req.cookies.accessToken;
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const userId = decoded._id;

    const update = {};
    if (req.body.firstName) {
      update.firstName = req.body.firstName;
    }
    if (req.body.lastName) {
      update.lastName = req.body.lastName;
    }
    if (req.body.email) {
      update.email = req.body.email;
    }
    if (req.body.address) {
      update.address = req.body.address;
    }
    if (req.body.city) {
      update.city = req.body.city;
    }
    if (req.body.postcode) {
      update.postcode = req.body.postcode;
    }
    if (req.body.country) {
      update.country = req.body.country;
    }
    const userProfile = await Profile.findOneAndUpdate(
      { userId: userId },
      { $set: update },
      { new: true }
    );

    res
      .status(200)
      .json({ message: "Succesfully updated profile!", userProfile });
  } catch (error) {
    res.status(500).json({ message: "Could not update details", error });
  }
});

router.post("/add-profile", (req, res) => {
  try {
    const token = req.cookies.accessToken;
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const userId = decoded._id;

    const { firstName, lastName, email, address, city, postcode, country } =
      req.body;

    const newProfile = new Profile({
      firstName,
      lastName,
      email,
      userId,
      address,
      city,
      postcode,
      country,
    });

    newProfile.save((error, savedProfile) => {
      if (error) {
        return res.status(500).json({
          error: "Error creating profile",
        });
      }
      res
        .status(200)
        .json({ message: "Profile succesfully created!", savedProfile });
    });
  } catch (error) {
    res.status(500).json({ message: "Could not create profile", error });
  }
});

module.exports = router;
