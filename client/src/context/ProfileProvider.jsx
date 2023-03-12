import React, { useState } from "react";

export const ProfileContext = React.createContext();

export default function ProfileProvider({ children }) {
  const [profileData, setProfileData] = useState(null);
  const [profilePicture, setProfilePicture] = useState(null);
  const [loading, setLoading] = useState(false);

  return (
    <ProfileContext.Provider
      value={{
        profileData,
        setProfileData,
        loading,
        setLoading,
        profilePicture,
        setProfilePicture,
      }}
    >
      {children}
    </ProfileContext.Provider>
  );
}
