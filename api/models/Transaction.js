const mongoose = require("mongoose");
// const Schema =require("")
//  var currentdate = new Date();
//   var DateTime =
//     "Last Sync: " +
//     currentdate.getDay() +
//     "-" +
//     currentdate.getMonth() +
//     "-" +
//     currentdate.getFullYear() +
//     " @ " +
//     currentdate.getMinutes() +
//     ":" +
//     currentdate.getHours();

const { Schema, model } = mongoose;

const TransactionSchema = new Schema({
  user: {
    type: String,
  },
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
