import { useContext, useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";
import { InvoiceContext } from "../context/InvoiceProvider";
import { ModalContext } from "../context/ModalProvider";
import { invoiceTotal, color, bg, buttonStyles } from "../utils";
import { Button, CircularProgress } from "@mui/material";
import { arrowLeft } from "../assets";
import { PDFExport, savePDF } from "@progress/kendo-react-pdf";
import { AnimatePresence, motion } from "framer-motion";
import Api from "../api";

export default function Invoice() {
  const [total, setTotal] = useState(null);
  const {
    selectedInvoice,
    setSelectedInvoice,
    setAllData,
    setFilteredInvoices,
  } = useContext(InvoiceContext);
  const { setModalIsOpen, setEditMode } = useContext(ModalContext);
  const [invoiceStatus, setInvoiceStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const pdfExportComponent = useRef();
  const contentArea = useRef();

  const invoice =
    JSON.parse(localStorage.getItem("selectedInvoice")) || selectedInvoice;

  useEffect(() => {
    if (invoice) {
      setInvoiceStatus(invoice.status);
      setTotal(invoiceTotal(invoice.data));
    }
  }, []);

  const editInvoice = () => {
    setModalIsOpen(true);
    setEditMode(true);
  };

  const deleteInvoice = async () => {
    setLoading(true);
    await Api.deleteInvoice(invoice._id);
    const res = await Api.getInvoices();
    setAllData(res);
    setFilteredInvoices(res);
    setSelectedInvoice(null);
    localStorage.removeItem("selectedInvoice");
    setLoading(false);
    navigate("/home");
  };

  const markAsPaid = async () => {
    setInvoiceStatus("paid");
    const newData = {
      ...invoice,
      data: {
        ...invoice.data,
        status: "paid",
      },
    };
    localStorage.setItem("selectedInvoice", JSON.stringify(newData));
    selectedInvoice.data.status = "paid";
    await Api.editInvoice(invoice._id, newData);
  };

  const goBack = () => {
    setSelectedInvoice(null);
    localStorage.removeItem("selectedInvoice");
    navigate("/home");
  };

  function PDFcomponent() {
    return (
      <div className="invoice | mt-6 py-6 my-4 px-7 text-xs rounded-md bg-[#fff] dark:bg-primary dark:bg-opacity-10">
        <div className="top | flex justify-between">
          <div className="left | flex flex-col">
            <p className="text-base font-bold">#{invoice.data.id}</p>
            <p>{invoice.data.description}</p>
          </div>

          <div className="right | flex flex-col">
            <p>
              {invoice.data.userFirstName + " " + invoice.data.userLastName}
            </p>
            <p>{invoice.data.userEmail}</p>
            <p className="mt-2">{invoice.data.userAdress}</p>
            <p>{invoice.data.userCity}</p>
            <p>{invoice.data.userPostcode}</p>
            <p>{invoice.data.userCountry}</p>
          </div>
        </div>
        <div className="middle | flex gap-12 mt-6 font-medium">
          <div className="dates | flex flex-col justify-between mr-6">
            <div className="flex flex-col gap-3">
              <p className="font-light">Invoice Date</p>
              <p>{invoice.data.createdAt}</p>
            </div>
            <div className="flex flex-col gap-3">
              <p className="font-light">Invoice Due</p>
              <p>{invoice.data.dueBy}</p>
            </div>
          </div>

          <div className="billing | flex flex-col gap-3 font-medium">
            <p className="font-light">Bill to</p>
            <p>{invoice.data.clientName}</p>
            <div>
              <p>{invoice.data.clientAdress}</p>
              <p>{invoice.data.clientCity}</p>
              <p>{invoice.data.clientPostcode}</p>
              <p>{invoice.data.clientCountry}</p>
            </div>
          </div>

          <div className="email | flex flex-col gap-3 font-medium">
            <p className="font-light">Sent to</p>
            <p>{invoice.data.clientEmail}</p>
          </div>
        </div>

        <div className="amounts | mt-10 my-4 rounded-xl bg-[rgba(121,121,121,0.05)] dark:bg-[rgba(255,255,255,0.05)]">
          <div className="labels | grid grid-cols-4 text-xs mb-8 pt-6 px-7 font-light text-text dark:text-text-dark">
            <div className="flex">
              <p>Item Name</p>
            </div>
            <div className="flex justify-center">
              <p>QTY.</p>
            </div>
            <div className="flex justify-center">
              <p>Price</p>
            </div>
            <div className="flex justify-end">
              <p>Total</p>
            </div>
          </div>
          <div className="flex flex-col gap-5 text-xs mb-8 px-7 font-medium text-text dark:text-text-dark">
            {invoice && invoice.data.services ? (
              invoice.data.services.map((service, i) => (
                <div key={i} className="service | grid grid-cols-4 w-full">
                  <div className="flex">
                    <p>{service.description}</p>
                  </div>
                  <div className="flex justify-center">
                    <p>{service.quantity}</p>
                  </div>
                  <div className="flex justify-center">
                    <p>${service.price}</p>
                  </div>
                  <div className="flex justify-end">
                    <p>${service.quantity * service.price}</p>
                  </div>
                </div>
              ))
            ) : (
              <></>
            )}
          </div>
          <div className="total | flex justify-between items-center bg-[rgb(56,59,81)] dark:bg-draft text-text-dark dark:text-text-dark rounded-b-xl px-6 py-6">
            <p className="font-light text-xs">Amount Due</p>
            <p className="text-2xl font-bold">${total}</p>
          </div>
        </div>
      </div>
    );
  }

  const handleExportWithMethod = (event) => {
    savePDF(contentArea.current, { paperSize: "A4" });
  };

  return (
    <AnimatePresence>
      {invoice && (
        <motion.div
          initial={{ x: 400, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -400, opacity: 0 }}
          transition={{ type: "tween" }}
          className="w-full min-h-screen flex flex-col items-center"
        >
          {loading && (
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <CircularProgress
                size={24}
                style={{ color: "rgb(119,94,241)" }}
              />
            </div>
          )}
          <div className="text-text dark:text-text-dark w-[750px]">
            <div className="flex justify-between">
              <button
                className="pt-12 flex gap-3 items-center text-xs"
                onClick={goBack}
              >
                <img src={arrowLeft} alt="back" />
                Go back
              </button>
              <button
                className={`pt-12 flex gap-3 items-center text-xs transition-all ${
                  loading ? "opacity-20" : "opacity-100"
                }`}
                onClick={handleExportWithMethod}
                disabled={loading ? true : false}
              >
                Export invoice to PDF{" "}
                <FileDownloadOutlinedIcon
                  style={{ width: "17px", color: "rgb(119,94,241)" }}
                />
              </button>
            </div>
            <div className="flex justify-between text-xs mt-6 py-6 my-4 px-7 rounded-md bg-[#fff] dark:bg-primary dark:bg-opacity-10">
              <div className="status | flex items-center gap-6 bg">
                Status
                <AnimatePresence>
                  {!loading && (
                    <motion.div
                      initial={{ opacity: 0, scale: "30%" }}
                      animate={{ opacity: 1, scale: "100%" }}
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
                      {invoiceStatus ? invoiceStatus : invoice.data.status}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              <div className="controls | flex gap-3">
                {invoice?.data?.status !== "paid" && (
                  <Button
                    variant="text"
                    onClick={() => editInvoice()}
                    disabled={loading ? true : false}
                    sx={{
                      ...buttonStyles,
                      background: "rgba(128,136,191,.05)",
                      "&:hover": {
                        background: "rgba(128,136,191,.15)",
                      },
                    }}
                  >
                    Edit
                  </Button>
                )}

                <Button
                  variant="text"
                  onClick={() => deleteInvoice()}
                  disabled={loading ? true : false}
                  sx={{
                    ...buttonStyles,
                    color: "white",
                    background: "rgba(219,97,92,1)",
                    "&:hover": {
                      background: "rgba(219,97,92,.6)",
                    },
                  }}
                >
                  Delete
                </Button>
                {invoice?.data?.status !== "paid" && (
                  <Button
                    variant="text"
                    onClick={() => markAsPaid()}
                    disabled={loading ? true : false}
                    sx={{
                      ...buttonStyles,
                      background: "rgb(228,223,252)",
                      "&:hover": {
                        background: "rgb(228,223,252)",
                      },
                    }}
                  >
                    Mark as paid
                  </Button>
                )}
              </div>
            </div>
            {!loading && (
              <AnimatePresence>
                <motion.div
                  initial={{ opacity: 0, scale: "60%" }}
                  animate={{ opacity: 1, scale: "100%" }}
                  transition={{ type: "tween" }}
                >
                  <PDFExport ref={pdfExportComponent} paperSize="A4">
                    <div ref={contentArea}>
                      <PDFcomponent />
                    </div>
                  </PDFExport>
                </motion.div>
              </AnimatePresence>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
