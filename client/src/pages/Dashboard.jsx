import { useContext } from "react";
import { InvoiceContext } from "../context/InvoiceProvider";
import { AnimatePresence, motion } from "framer-motion";
import ReceiptIcon from "@mui/icons-material/Receipt";
import ShowChartIcon from "@mui/icons-material/ShowChart";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import AssessmentIcon from "@mui/icons-material/Assessment";
import { PieChart } from "../components/Chart/PieChart";
import { BarChart } from "../components/Chart/BarChart";
import {
  getInvoicesNumber,
  getPaidTotal,
  getPendingTotal,
  getYearData,
} from "../utils";
import { CircularProgress } from "@mui/material";
import { arrowLeft } from "../assets";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const { allData, loading, setSelectedInvoice } = useContext(InvoiceContext);
  const navigate = useNavigate();

  const cards = [
    {
      title: "Total invoices this month",
      amount: getInvoicesNumber(allData),
      type: "number",
      icon: <ReceiptIcon />,
    },
    {
      title: "Revenue this month",
      amount: getPaidTotal(allData),
      type: "amount",
      icon: <ShowChartIcon />,
    },
    {
      title: "Unpaid invoices",
      amount: getPendingTotal(allData),
      type: "amount",
      icon: <AccessTimeIcon />,
    },
  ];

  const goBack = () => {
    setSelectedInvoice(null);
    localStorage.removeItem("selectedInvoice");
    navigate("/home");
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
        <div className="text-text dark:text-text-dark w-[750px] mb-24">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold pt-16">Dashboard</h1>
            <button
              className="pt-12 flex gap-3 items-center text-xs"
              onClick={goBack}
            >
              <img src={arrowLeft} alt="back" />
              Go back
            </button>
          </div>
          <div className="grid grid-cols-3 gap-6 pt-16">
            {cards.map((card, i) => (
              <div key={i}>
                <div className="rounded-md custom-border text-xs px-6 py-6 text-center flex flex-col justify-between items-center bg-[#fff] dark:bg-primary dark:bg-opacity-10">
                  <div className="rounded-full mb-3 bg-primary p-3 text-text-dark dark:text-text-dark">
                    {card.icon}
                  </div>
                  <p className="mb-4 text-text-sec dark:text-text-sec-dark font-light">
                    {card.title}
                  </p>
                  <p className="font-bold text-xl">
                    {card.type === "amount" ? `$ ${card.amount}` : card.amount}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "50% 5% 45%",
              alignItems: "center",
            }}
          >
            <PieChart />
            <div></div>
            <div className="rounded-md h-5/6 text-xs text-text-sec-dark px-6 py-6 text-center flex flex-col items-center custom-bg">
              <div className="rounded-full mb-3 bg-primary p-3 text-text-dark dark:text-text-dark">
                <AssessmentIcon />
              </div>
              <p className="mb-4 font-light">Invoices created this year</p>
              <p className="font-bold text-xl mb-6 mt-6">
                {allData && getYearData(allData)[0]}{" "}
                <span className="font-light">invoices</span>
              </p>
              <p className="font-bold text-xl">
                ${allData && getYearData(allData)[1]}{" "}
                <span className="font-light">total</span>
              </p>
            </div>
          </div>
          <BarChart />
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
