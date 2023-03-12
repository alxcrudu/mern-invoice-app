const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const Invoice = require("../../models/Invoice");
const dotenv = require("dotenv");
dotenv.config();

router.post("/add", (req, res) => {
  try {
    const token = req.cookies.accessToken;
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const userId = decoded._id;

    const invoice = new Invoice({
      data: req.body,
      userId: userId,
    });
    invoice
      .save()
      .then(() =>
        res.status(200).json({ message: "Invoice created succesfully!" })
      )
      .catch((err) => res.status(400).json(err));
  } catch (error) {
    console.error(error);
    res.status(500).json({ error });
  }
});

router.get("/get", async (req, res) => {
  try {
    const token = req.cookies.accessToken;
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const userId = decoded._id;
    const allInvoices = await Invoice.find({ userId: userId });

    res.status(200).json({ allInvoices });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Could not retrieve invoices!" });
  }
});

router.put("/update/:id", async (req, res) => {
  try {
    const token = req.cookies.accessToken;
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const userId = decoded._id;

    const updatedInvoice = await Invoice.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
      }
    );
    if (updatedInvoice.userId.toString() !== userId.toString())
      return res
        .status(401)
        .json({ message: "Unauthorized to update invoice!" });
    if (!updatedInvoice)
      return res
        .status(404)
        .json({ message: "Invoice not found in database!" });

    res.status(200).json(updatedInvoice);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Could not update invoice!" });
  }
});

router.delete("/delete/:id", async (req, res) => {
  try {
    const token = req.cookies.accessToken;
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const userId = decoded._id;

    const invoiceToBeDeleted = await Invoice.findById(req.params.id);

    if (!invoiceToBeDeleted)
      return res
        .status(404)
        .json({ message: "Invoice not found in database!" });

    if (invoiceToBeDeleted.userId.toString() !== userId.toString())
      return res.status(401).json({ message: "Unauthorized" });

    await invoiceToBeDeleted.remove();

    return res.status(200).json({ message: "Item deleted" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Could not delete invoice!" });
  }
});

module.exports = router;
