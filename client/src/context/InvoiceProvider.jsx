import React, { useState } from "react";

export const InvoiceContext = React.createContext();

export default function InvoiceProvider({ children }) {
  const [allData, setAllData] = useState(null);
  const [selectedInvoice, setSelectedInvoice] = useState(
    JSON.parse(localStorage.getItem("selectedInvoice")) || null
  );
  const [checked, setChecked] = useState([true, true, true]);
  const [filteredInvoices, setFilteredInvoices] = useState(null);
  const [loading, setLoading] = useState(false);

  return (
    <InvoiceContext.Provider
      value={{
        allData,
        setAllData,
        selectedInvoice,
        setSelectedInvoice,
        checked,
        setChecked,
        filteredInvoices,
        setFilteredInvoices,
        loading,
        setLoading,
      }}
    >
      {children}
    </InvoiceContext.Provider>
  );
}
