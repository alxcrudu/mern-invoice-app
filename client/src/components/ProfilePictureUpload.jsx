import React, { useContext, useState } from "react";
import { ProfileContext } from "../context/ProfileProvider";
import { Button } from "@mui/material";
import Api from "../api";
import { avatarRender, buttonStyles } from "../utils";
import { AnimatePresence, motion } from "framer-motion";

export default function ProfilePictureUpload() {
  const [changes, setChanges] = useState(false);
  const [success, setSuccess] = useState(null);
  const { profilePicture, setProfilePicture, profileData } =
    useContext(ProfileContext);

  function handleProfilePictureChange(e) {
    setChanges(true);
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      setProfilePicture(reader.result);
    };
  }

  async function handleFormSubmit(e) {
    e.preventDefault();
    setChanges(false);
    try {
      await Api.uploadProfilePicture(profilePicture);
      setSuccess(1);
      setTimeout(() => {
        setSuccess(null);
      }, 3000);
    } catch (error) {
      console.error(error);
      setSuccess(0);
      setTimeout(() => {
        setSuccess(null);
      }, 3000);
    }
  }

  return (
    <div className="flex items-center w-full">
      {avatarRender(
        profilePicture,
        profileData?.firstName,
        profileData?.lastName,
        65
      )}
      <form
        onSubmit={handleFormSubmit}
        className="flex items-center justify-between text-xs ml-6 w-full"
      >
        <div className="flex flex-col gap-2 mt-3">
          <label
            className="text-text-sec dark:text-text-sec-dark"
            htmlFor="profilePictureInput"
          >
            Upload Profile Picture
          </label>
          <input
            id="profilePictureInput"
            type="file"
            accept="image/*"
            onChange={handleProfilePictureChange}
          />
        </div>
        {changes && (
          <Button sx={{ ...buttonStyles }} type="submit">
            Save Changes
          </Button>
        )}
      </form>
      <AnimatePresence>
        {success === 1 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-xs text-text-sec dark:text-text-sec-dark"
          >
            {<p>Changes saved</p>}
          </motion.div>
        )}
        {success === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-xs text-text-sec dark:text-text-sec-dark"
          >
            {<p>Could not save changes</p>}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
