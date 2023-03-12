import React, { useState } from "react";

export const ModalContext = React.createContext();

export default function ModalProvider({ children }) {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [editMode, setEditMode] = useState(true);

  return (
    <ModalContext.Provider
      value={{
        modalIsOpen,
        setModalIsOpen,
        editMode,
        setEditMode,
      }}
    >
      {children}
    </ModalContext.Provider>
  );
}
