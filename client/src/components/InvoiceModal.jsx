import React, { useState, useEffect, useContext, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Button, TextField } from "@mui/material";
import { ThemeContext } from "../context/ThemeProvider";
import { ModalContext } from "../context/ModalProvider";
import { motion, AnimatePresence } from "framer-motion";
import { buttonStyles, getCurrentDate, invoiceTotal } from "../utils";
import { InvoiceContext } from "../context/InvoiceProvider";
import { iconDelete } from "../assets";
import Api from "../api";
import { ProfileContext } from "../context/ProfileProvider";

const defaultInput = {
  services: [
    {
      description: "",
      price: 0,
      quantity: 1,
    },
  ],
};

export default function InvoiceModal() {
  const [date, setDate] = useState(null);
  const [inputs, setInputs] = useState(defaultInput);
  const { theme } = useContext(ThemeContext);
  const { profileData } = useContext(ProfileContext);
  const { modalIsOpen, setModalIsOpen, editMode } = useContext(ModalContext);
  const {
    selectedInvoice,
    setSelectedInvoice,
    setFilteredInvoices,
    setAllData,
  } = useContext(InvoiceContext);
  const modalRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (selectedInvoice) {
      return setInputs(selectedInvoice.data);
    }
    if (profileData) {
      setInputs({
        ...inputs,
        userFirstName: profileData?.firstName,
        userLastName: profileData?.lastName,
        userEmail: profileData?.email,
        userAddress: profileData?.address,
        userCity: profileData?.city,
        userPostcode: profileData?.postcode,
        userCountry: profileData?.country,
      });
    } else {
      setInputs(defaultInput);
    }
  }, [modalIsOpen]);

  useEffect(() => {
    setDate(getCurrentDate());
  }, []);

  const formStyles = {
    fontSize: ".9em",
    "& .MuiOutlinedInput-root": {
      fontFamily: "Spartan",
      fontSize: ".9em",
      color: theme === "dark" ? "white" : "black",
      "& fieldset": {
        fontFamily: "Spartan",
        fontSize: ".9em",
        borderColor:
          theme === "dark" ? "rgba(255,255,255,.3)" : "rgba(0,0,0,.15)",
      },
      "&:hover fieldset": {
        fontFamily: "Spartan",
        fontSize: ".9em",
        borderColor:
          theme === "dark" ? "rgba(255,255,255,.4)" : "rgba(0,0,0,.3)",
      },
      "&.Mui-focused fieldset": {
        fontFamily: "Spartan",
        fontSize: ".9em",
        borderColor:
          theme === "dark" ? "rgba(255,255,255,.4)" : "rgba(0,0,0,.3)",
      },
    },
    "& .MuiFormLabel-root": {
      fontFamily: "Spartan",
      fontSize: ".9em",
      color: theme === "dark" ? "white" : "black",
      "&.Mui-focused": {
        fontFamily: "Spartan",
        fontSize: ".9em",
        color: theme === "dark" ? "white" : "black",
      },
    },
  };

  const discard = () => {
    setModalIsOpen(false);
    setInputs(defaultInput);
  };

  const saveDraft = async () => {
    const total = invoiceTotal(inputs);
    const randomNumber = Math.floor(Math.random() * 1000000)
      .toString()
      .padStart(6, "0");
    await Api.createInvoice({
      ...inputs,
      dueBy: inputs.dueBy || date,
      id: randomNumber,
      createdAt: date,
      total: total,
      status: "draft",
    });
    await Api.getInvoices().then((res) => {
      setFilteredInvoices(res);
      setAllData(res);
    });
    discard();
  };

  const saveInvoice = async () => {
    const total = invoiceTotal(inputs);
    const randomNumber = Math.floor(Math.random() * 1000000)
      .toString()
      .padStart(6, "0");
    await Api.createInvoice({
      ...inputs,
      dueBy: inputs.dueBy || date,
      id: randomNumber,
      createdAt: date,
      total: total,
      status: "pending",
    });
    await Api.getInvoices().then((res) => {
      setFilteredInvoices(res);
      setAllData(res);
    });
    discard();
  };

  const editInvoice = async () => {
    const total = invoiceTotal(inputs);
    const newInvoice = {
      ...selectedInvoice,
      data: {
        ...inputs,
        dueBy: inputs.dueBy || date,
        total: total,
        status: "pending",
      },
    };
    await Api.editInvoice(selectedInvoice._id, newInvoice).then(() => {
      setSelectedInvoice(newInvoice);
      localStorage.setItem("selectedInvoice", JSON.stringify(newInvoice));
      discard();
      navigate("/invoice");
    });
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        discard();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleChange = (event) => {
    let { name, value } = event.target;
    if (name.startsWith("service_")) {
      const serviceIndex = name.split("_")[1];
      const serviceField = name.split("_")[2];
      let services = [...inputs.services];
      services[serviceIndex][serviceField] = value;
      setInputs({ ...inputs, services });
    } else {
      setInputs({ ...inputs, [name]: value });
    }
  };

  const addService = () => {
    setInputs({
      ...inputs,
      services: [
        ...inputs.services,
        {
          description: "",
          quantity: 1,
          price: 0,
        },
      ],
    });
  };

  const removeService = (index) => {
    let services = [...inputs.services];
    services.splice(index, 1);
    setInputs({ ...inputs, services });
  };

  const renderServices = () => {
    const setService = (index, newService) => {
      const services = [...inputs.services];
      services[index] = newService;
      setInputs({ ...inputs, services });
    };

    return inputs?.services?.map((service, index) => (
      <div key={index} className="custom-cols">
        <TextField
          label="Description"
          sx={{ ...formStyles }}
          name={`service_${index}_description`}
          value={service.description || ""}
          onChange={(e) =>
            setService(index, { ...service, description: e.target.value })
          }
          id="outlined-basic"
          variant="outlined"
          size="medium"
        />
        <TextField
          label="QTY."
          sx={{ ...formStyles }}
          name={`service_${index}_quantity`}
          value={service.quantity || ""}
          onChange={(e) =>
            setService(index, { ...service, quantity: e.target.value })
          }
          id="outlined-basic"
          variant="outlined"
          size="medium"
        />
        <TextField
          label="Price"
          sx={{ ...formStyles }}
          name={`service_${index}_price`}
          value={service.price || ""}
          onChange={(e) =>
            setService(index, { ...service, price: e.target.value })
          }
          id="outlined-basic"
          variant="outlined"
          size="medium"
        />
        <TextField
          sx={{ ...formStyles }}
          value={service.quantity * service.price}
          id="outlined-read-only-input"
          label="Total"
          InputProps={{
            readOnly: true,
          }}
        />
        <Button onClick={() => removeService(index)}>
          <img src={iconDelete} alt="delete" />
        </Button>
      </div>
    ));
  };

  return (
    <AnimatePresence>
      {modalIsOpen && (
        <motion.div
          ref={modalRef}
          initial={{ x: -700, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -700, opacity: 0 }}
          transition={{ type: "tween" }}
          className="w-1/2 h-full bg-[#fff] fixed dark:bg-bg-dark rounded-tr-3xl rounded-br-3xl overflow-scroll z-10"
        >
          <div className="ml-28 mr-6 text-sm">
            <div className="mt-10 flex flex-col gap-6">
              <h2 className="text-text dark:text-text-dark">Bill from</h2>
              <div className="flex gap-4">
                <TextField
                  value={inputs?.userFirstName || ""}
                  sx={{ ...formStyles }}
                  onChange={handleChange}
                  name="userFirstName"
                  id="outlined-basic"
                  label="User first name"
                  variant="outlined"
                  size="medium"
                />
                <TextField
                  value={inputs?.userLastName || ""}
                  sx={{ ...formStyles }}
                  onChange={handleChange}
                  name="userLastName"
                  id="outlined-basic"
                  label="User last name"
                  variant="outlined"
                  size="medium"
                />
                <TextField
                  value={inputs?.userEmail || ""}
                  sx={{ ...formStyles }}
                  onChange={handleChange}
                  name="userEmail"
                  id="outlined-basic"
                  label="User email"
                  variant="outlined"
                  size="medium"
                />
              </div>
              <TextField
                value={inputs?.userAddress || ""}
                sx={{ ...formStyles }}
                onChange={handleChange}
                name="userAddress"
                id="outlined-basic"
                fullWidth
                label="Street Address"
                variant="outlined"
                size="medium"
              />
              <div className="flex gap-4">
                <TextField
                  value={inputs?.userCity || ""}
                  sx={{ ...formStyles }}
                  onChange={handleChange}
                  name="userCity"
                  id="outlined-basic"
                  label="City"
                  variant="outlined"
                  size="medium"
                />
                <TextField
                  value={inputs?.userPostcode || ""}
                  sx={{ ...formStyles }}
                  onChange={handleChange}
                  name="userPostcode"
                  id="outlined-basic"
                  label="Postcode"
                  variant="outlined"
                  size="medium"
                />
                <TextField
                  value={inputs?.userCountry || ""}
                  sx={{ ...formStyles }}
                  onChange={handleChange}
                  name="userCountry"
                  id="outlined-basic"
                  label="Country"
                  variant="outlined"
                  size="medium"
                />
              </div>
            </div>
            <div className="mt-10 flex flex-col gap-6">
              <h2 className="text-text dark:text-text-dark">Bill to</h2>
              <TextField
                value={inputs?.clientName || ""}
                sx={{ ...formStyles }}
                onChange={handleChange}
                name="clientName"
                id="outlined-basic"
                fullWidth
                label="Client's Name"
                variant="outlined"
                size="medium"
              />
              <TextField
                value={inputs?.clientEmail || ""}
                sx={{ ...formStyles }}
                onChange={handleChange}
                name="clientEmail"
                id="outlined-basic"
                fullWidth
                label="Client's Email"
                variant="outlined"
                size="medium"
              />
              <TextField
                value={inputs?.clientAddress || ""}
                sx={{ ...formStyles }}
                onChange={handleChange}
                name="clientAddress"
                id="outlined-basic"
                fullWidth
                label="Street Address"
                variant="outlined"
                size="medium"
              />
              <div className="flex gap-4">
                <TextField
                  value={inputs?.clientCity || ""}
                  sx={{ ...formStyles }}
                  onChange={handleChange}
                  name="clientCity"
                  id="outlined-basic"
                  label="City"
                  variant="outlined"
                  size="medium"
                />
                <TextField
                  value={inputs?.clientPostcode || ""}
                  sx={{ ...formStyles }}
                  onChange={handleChange}
                  name="clientPostcode"
                  id="outlined-basic"
                  label="Postcode"
                  variant="outlined"
                  size="medium"
                />
                <TextField
                  value={inputs?.clientCountry || ""}
                  sx={{ ...formStyles }}
                  onChange={handleChange}
                  name="clientCountry"
                  id="outlined-basic"
                  label="Country"
                  variant="outlined"
                  size="medium"
                />
              </div>
            </div>
            <div className="mt-10 flex flex-col gap-6">
              <div className="flex flex-col">
                <span className="text-xs opacity-50 ml-2 mb-2 text-text dark:text-text-dark">
                  Due by
                </span>
                <TextField
                  value={inputs?.dueBy || ""}
                  sx={{ ...formStyles }}
                  onChange={handleChange}
                  name="dueBy"
                  type="date"
                  id="outlined-basic"
                  variant="outlined"
                  size="medium"
                />
              </div>
              {/* <DatePicker
            selected={selectedDate}
            onChange={(date) => setSelectedDate(date)}
            customInput={
              <label>Choose a date</label>
            }
          /> */}
              <TextField
                value={inputs?.terms || ""}
                sx={{ ...formStyles }}
                onChange={handleChange}
                name="terms"
                id="outlined-basic"
                label="Payment terms"
                variant="outlined"
                size="medium"
              />
              <TextField
                value={inputs?.description || ""}
                sx={{ ...formStyles }}
                onChange={handleChange}
                name="description"
                id="outlined-basic"
                label="Project description"
                variant="outlined"
                placeholder="eg: Graphic Design Service"
                size="medium"
              />
            </div>
            <div className="mt-10 flex flex-col gap-8">
              <h2 className="text-text dark:text-text-dark">Item List</h2>
              <div className="grid text-text dark:text-text-dark gap-3">
                {renderServices()}
              </div>
              <Button
                variant="text"
                onClick={() => addService()}
                sx={{
                  ...buttonStyles,
                  background: "transparent",
                  "&:hover": {
                    background: "rgba(128,136,191,.3)",
                  },
                }}
              >
                + Add Item
              </Button>
            </div>

            {/* new buttons start */}
            {!editMode && (
              <div className="my-10 flex justify-between">
                <div className="left">
                  <Button
                    variant="text"
                    onClick={() => discard()}
                    sx={{
                      ...buttonStyles,
                      background: "rgba(128,136,191,.05)",
                      "&:hover": {
                        background: "rgba(128,136,191,.15)",
                      },
                    }}
                  >
                    Discard
                  </Button>
                </div>
                <div className="right | flex gap-3">
                  <Button
                    variant="text"
                    onClick={() => saveDraft()}
                    sx={{
                      ...buttonStyles,
                      background: "rgb(56,59,81)",
                      "&:hover": {
                        background: "rgb(20,22,36)",
                      },
                    }}
                  >
                    Save as Draft
                  </Button>
                  <Button
                    variant="text"
                    onClick={() => saveInvoice()}
                    sx={{
                      ...buttonStyles,
                      background: "rgb(228,223,252)",
                      "&:hover": {
                        background: "rgb(228,223,252)",
                      },
                    }}
                  >
                    Save & Send
                  </Button>
                </div>
              </div>
            )}
            {/* new buttons end */}
            {/* edit buttons start */}
            {editMode && (
              <div className="flex justify-end items-center gap-3 my-10">
                <Button
                  variant="text"
                  onClick={() => discard()}
                  sx={{
                    ...buttonStyles,
                    background: "rgba(128,136,191,.05)",
                    "&:hover": {
                      background: "rgba(128,136,191,.15)",
                    },
                  }}
                >
                  Cancel
                </Button>
                <Button
                  variant="text"
                  onClick={() => editInvoice()}
                  sx={{
                    ...buttonStyles,
                    color: "#ffffff",
                    background: "rgba(119,94,241,1)",
                    "&:hover": {
                      background: "rgba(119,94,241,.6)",
                    },
                  }}
                >
                  Save
                </Button>
              </div>
            )}
            {/* edit buttons end */}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
