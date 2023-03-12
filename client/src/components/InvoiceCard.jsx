import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { arrowRight } from "../assets";
import { InvoiceContext } from "../context/InvoiceProvider";
import { motion } from "framer-motion";
import { color, bg } from "../utils";

export default function InvoiceCard({ invoice }) {
  const { setSelectedInvoice } = useContext(InvoiceContext);
  const navigate = useNavigate();

  const handleViewInvoice = (invoice) => {
    localStorage.setItem("selectedInvoice", JSON.stringify(invoice));
    setSelectedInvoice(invoice);
    navigate("/invoice");
  };

  return (
    <motion.div
      onClick={() => handleViewInvoice(invoice)}
      initial={{ y: -50, scale: "30%", opacity: 0 }}
      animate={{ y: 0, scale: "100%", opacity: 1 }}
      exit={{ y: -50, scale: "30%", opacity: 0 }}
      transition={{ type: "tween" }}
      className="w-full flex justify-between items-center cursor-pointer custom-border py-9 my-5 px-7 rounded-md bg-[#fff] dark:bg-primary dark:bg-opacity-10"
    >
      <div className="left flex gap-6 text-xs font-light text-text-sec dark:text-text-sec-dark">
        <p className="text-md font-bold text-text dark:text-text-dark">
          #{invoice.data.id}
        </p>
        <p>{invoice.data.createdAt}</p>
        <p>{invoice.data.clientName}</p>
      </div>
      <div className="right flex gap-6 items-center text-xs">
        <p className="text-sm font-semibold">$ {invoice.data.total}</p>
        <button
          className={`${color(
            invoice
          )} flex items-center justify-center gap-2 bg-opacity-5 py-2 w-28 rounded-md ${bg(
            invoice
          )}`}
        >
          <div
            className={`${bg(
              invoice
            )} w-2 h-2 rounded-full bg-opacity-100 dark:bg-opacity-100`}
          ></div>
          {invoice.data.status}
        </button>
        <img src={arrowRight} alt="Arrow Icon" />
      </div>
    </motion.div>
  );
}
