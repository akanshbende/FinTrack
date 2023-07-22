const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const app = express();
const User = require("./models/UserModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
require("dotenv").config();
const safeBuffer = require("safe-buffer");
const Transaction = require("./models/Transaction");
const { default: mongoose } = require("mongoose");
const secret = process.env.JWT_SECRET;

// const url = `${process.env.DB_URL}`;
// console.log(url);
app.use(cors());
app.use(express.json()); //parse body to json
app.use(bodyParser.json());

app.get("/api/test", (req, res) => {
  res.json("TEST OK");
});

app.listen(4040, () => {
  console.log("SERVER IS RUNNING AT 4040");
});

mongoose.connect(
  "mongodb+srv://AdminAkansh:Admin@clusterakansh.734wjwt.mongodb.net/FinTrack"
);

app.post("/api/register", async (req, res) => {
  // console.log(req.body);
  try {
    const hashPassword = await bcrypt.hash(req.body.password, 10);
    // console.log(hashPassword);
    await User.create({
      name: req.body.name,
      email: req.body.email,
      password: hashPassword,
    });

    res.json("OK");
  } catch (error) {
    console.log(error);
    res.json({ status: "error", message: "Duplicate Email" });
  }
});
app.post("/api/login", async (req, res) => {
  const user = await User.findOne({
    email: req.body.email,
    // password: req.body.password,
  });

  if (!user) {
    return { status: "error", error: "Invalid Login " };
  }

  const isPasswordValid = await bcrypt.compare(
    req.body.password,
    user.password
  );

  if (isPasswordValid) {
    const token = jwt.sign(
      { name: user.name, email: user.email, id: user._id },
      secret
    );
    return res.json({ status: "ok", user: token });
  } else {
    return res.json({
      status: "error",
      user: false,
    });
  }
  // res.json("OK");
});
app.post("/api/quote", async (req, res) => {
  const token = req.headers["x-access-token"];

  try {
    const decode = jwt.verify(token, secret);
    // console.log(decode);

    const email = decode.email;

    await User.updateOne(
      { email: email },
      {
        $set: {
          quote: req.body.quote,
        },
      }
    );
    return { status: "ok" };
  } catch (error) {
    console.log(error);
    res.json({ status: "error", error: "invalid_token" });
  }
});
app.get("/api/quote", async (req, res) => {
  const token = req.headers["x-access-token"];

  try {
    const decode = jwt.verify(token, secret);
    // console.log(decode);

    const email = decode.email;

    const user = await User.findOne({ email: email });

    return res.json({ status: "ok", quote: user.quote });
  } catch (error) {
    console.log(error);
    res.json({ status: "error", error: "invalid_token" });
  }
});

app.post("/api/transaction", async (req, res) => {
  const token = req.headers["x-access-token"];

  // console.log(decode);
  try {
    const decode = jwt.verify(token, secret);
    const userId = decode._id;

    const { name, price, description, datetime } = req.body;
    const newTransaction = new Transaction({
      name,
      price,
      description,
      datetime,
    });

    const savedTransaction = await newTransaction.save();
    // console.log(savedTransaction);
    const user = await User.findOne(userId);
    user.transactions.push(savedTransaction._id);
    await user.save();

    res.json({ status: "ok", data: savedTransaction });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

// app.get("/api/transactions", async (req, res) => {
//   const token = req.headers["x-access-token"];

//   // console.log(decode);
//   try {
//     const decode = jwt.verify(token, secret);
//     const userId = decode._id;

//     const user = await User.findOne(userId);
//     const transactions = await Transaction.find({ userId: userId });
//     return res.json({ status: "ok", user: user, transactions: transactions });
//   } catch (error) {
//     res.status(500).json({ error: "Server error" });
//   }
// });

//-----------------------------------------------------------------------------
app.post("/api/add-transaction", async (req, res) => {
  const token = req.headers["x-access-token"];
  try {
    const decode = jwt.verify(token, secret);

    // Get the user ID from the request (assuming you have implemented user authentication and have access to the authenticated user's ID)
    const userId = decode.id; // Replace this with the actual way to get the authenticated user's ID
    // console.log("add Transaction " + userId);
    const { name, price, description, datetime } = req.body;
    // Create a new transaction and associate it with the user
    const newTransaction = await Transaction.create({
      user: userId,
      // Include other transaction details from the request body
      name,
      price,
      description,
      datetime,
      // Add any other transaction-related data here
    });
    await newTransaction.save();

    // Add the newly created transaction ID to the user's transactions array
    await User.findOneAndUpdate(
      { userId },
      { $push: { transactions: newTransaction._id } }
    );

    res.json({ status: "ok", message: "Transaction added successfully" });
  } catch (error) {
    console.log(error);
    res.json({ status: "error", message: "Failed to add transaction" });
  }
});

app.get("/api/user-transactions/:userId", async (req, res) => {
  const token = req.headers["x-access-token"];
  try {
    const decode = jwt.verify(token, secret);
    // const user = decode.user;

    // Get the user ID from the request (assuming you have implemented user authentication and have access to the authenticated user's ID)
    const userId = decode.id;
    // console.log("userId : " + userId);
    // Find the user's transactions using their user ID
    const transactions = await Transaction.find({ user: userId });

    res.json({ status: "ok", transactions });
    // console.log(transactions);
  } catch (error) {
    console.log(error);
    res.json({ status: "error", message: "Failed to get user transactions" });
  }
});
//------------------------------------------------------------------------------

app.delete("/api/transactions/:transactionId", async (req, res) => {
  const token = req.headers["x-access-token"];
  const { transactionId } = req.params;
  console.log("transactionId: " + transactionId);

  try {
    const decode = jwt.verify(token, secret);
    const userId = decode.id;

    // const transactionIdObjectId = mongoose.Types.ObjectId(transactionId);
    console.log("userId: " + userId);
    console.log(transactionId);
    const transaction = await Transaction.findOne({
      _id: transactionId,
      user: userId,
    });

    console.log("transaction : " + transaction);
    // Check if the user has the transaction with the given ID
    if (!transaction) {
      return res.status(404).json({ error: "Transaction not found" });
    }

    // Check if the user ID in the transaction matches the signed-in user's ID
    if (String(transaction.user) !== String(userId)) {
      return res
        .status(403)
        .json({ error: "You are not authorized to delete this transaction" });
    }

    // Delete the transaction
    await Transaction.deleteOne({ _id: transactionId });

    return res.json({ message: "Transaction deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

// Update transaction
app.put("/api/transaction/:userId/:transactionId", async (req, res) => {
  const { userId, transactionId } = req.params;

  try {
    // Find the user by ID and check if the user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Check if the user has the transaction with the given ID
    if (!user.transactions.includes(transactionId)) {
      return res
        .status(404)
        .json({ error: "Transaction not found for this user" });
    }

    // Update the transaction in the Transaction collection
    const updatedTransaction = await Transaction.findByIdAndUpdate(
      transactionId,
      {
        name: req.body.name,
        price: req.body.price,
        description: req.body.description,
        datetime: req.body.datetime,
      },
      { new: true } // Return the updated transaction in the response
    );

    res.json({ status: "ok", data: updatedTransaction });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

app.post("/api/logout", (req, res) => {
  const token = req.headers["x-access-token"];

  // You can add the token to the blacklist or simply invalidate it here
  // For blacklisting:
  // blacklist.push(token);

  // For token invalidation, you can use a library or your own mechanism.
  // For example, setting the token's expiration time to a past date.

  res.json({ message: "Logout successful" });
});
