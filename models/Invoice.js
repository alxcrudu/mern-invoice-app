const mongoose = require("mongoose");

const InvoiceSchema = new mongoose.Schema({
  data: {
    type: Object,
    required: true,
  },
  userId: {
    type: mongoose.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

const Invoice = mongoose.model("Invoice", InvoiceSchema);

module.exports = Invoice;
