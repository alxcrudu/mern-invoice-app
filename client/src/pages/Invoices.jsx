import { useContext, useState } from "react";
import Menu from "@mui/material/Menu";
import Button from "@mui/material/Button";
import { arrowDown, iconPlus } from "../assets";
import { InvoiceContext } from "../context/InvoiceProvider";
import { ModalContext } from "../context/ModalProvider";
import { buttonStyles } from "../utils";
import InvoiceCard from "../components/InvoiceCard";
import { ThemeContext } from "../context/ThemeProvider";
import Checkboxes from "../components/Checkboxes";
import { AnimatePresence, motion } from "framer-motion";
import { CircularProgress } from "@mui/material";

export default function Invoices() {
  const { setModalIsOpen, setEditMode } = useContext(ModalContext);
  const { setSelectedInvoice, loading, filteredInvoices, allData } =
    useContext(InvoiceContext);
  const { theme } = useContext(ThemeContext);

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const addNewInvoice = () => {
    setSelectedInvoice(null);
    localStorage.removeItem("selectedInvoice");
    setEditMode(false);
    setModalIsOpen(true);
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ x: -400, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: 400, opacity: 0 }}
        transition={{ type: "tween" }}
        className="container | w-screen min-h-screen flex flex-col items-center"
      >
        {loading && (
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <CircularProgress size={24} style={{ color: "rgb(119,94,241)" }} />
          </div>
        )}
        <div className="text-text dark:text-text-dark flex justify-between w-[750px] pt-16">
          <div className="left">
            <h1 className="text-3xl font-bold">Invoices</h1>
            <p
              className={`${
                loading ? "opacity-0" : "opacity-100"
              } transition-opacity text-xs font-light pt-2 text-text-sec dark:text-text-sec-dark`}
            >
              There are {allData && allData.length} total invoices
            </p>
          </div>
          <div className="right flex items-center h-min gap-8">
            <div className="cursor-pointer flex items-center gap-3 text-xs font-medium">
              <Button
                id="basic-button"
                aria-controls={open ? "basic-menu" : undefined}
                aria-haspopup="true"
                aria-expanded={open ? "true" : undefined}
                onClick={handleClick}
                disabled={loading ? true : false}
                sx={{
                  ...buttonStyles,
                  fontSize: "1em",
                  textTransform: "initial",
                  color: theme === "light" ? "black" : "white",
                }}
              >
                <p className="mr-3">Filter by status</p>
                <img
                  src={arrowDown}
                  alt="Arrow down"
                  className={`transition-all ${open ? "rotate-180" : ""}`}
                />
              </Button>
              <Menu
                id="basic-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                MenuListProps={{
                  "aria-labelledby": "basic-button",
                }}
                PaperProps={{
                  sx: { boxShadow: "rgba(119,94,241, 0.2) 0px 8px 24px" },
                }}
                sx={{
                  "& .MuiList-root": {
                    padding: "1em",
                  },
                }}
              >
                <Checkboxes />
              </Menu>
            </div>
            <button
              onClick={() => addNewInvoice()}
              disabled={loading ? true : false}
              className={`rounded-full text-xs bg-primary transition-all hover:bg-opacity-60 py-2 px-2 flex items-center gap-3 text-text-dark dark:text-text-dark ${
                loading ? "opacity-20" : "opacity-100"
              }`}
            >
              <div className="bg-bg p-3 rounded-full">
                <img src={iconPlus} alt="Add invoice" />
              </div>
              New Invoice
            </button>
          </div>
        </div>
        <div className="w-[750px] text-text dark:text-text-dark mt-8 pb-16">
          {!loading && (
            <AnimatePresence>
              {filteredInvoices && filteredInvoices.length !== 0 ? (
                filteredInvoices.map((invoice, i) => (
                  <InvoiceCard key={i} invoice={invoice} />
                ))
              ) : (
                <div className="text-xs font-light text-center text-primary">
                  No invoices selected...
                </div>
              )}
            </AnimatePresence>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
