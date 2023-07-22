const mongoose = require("mongoose");
// const Schema =require("")
const { Schema, model } = mongoose;

const TransactionSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
  },

  datetime: {
    type: Date,
    default: Date.now,
  },
});

const TransactionModel = model("Transaction", TransactionSchema);

module.exports = TransactionModel;
