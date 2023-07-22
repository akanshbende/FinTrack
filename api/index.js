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
  console.log(req.body);
  try {
    const hashPassword = await bcrypt.hash(req.body.password, 10);
    console.log(hashPassword);
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
    console.log(decode);

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
    console.log(decode);

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
    console.log(savedTransaction);
    const user = await User.findOne(userId);
    user.transactions.push(savedTransaction._id);
    await user.save();

    res.json({ status: "ok", data: savedTransaction });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

app.get("/api/transactions", async (req, res) => {
  const token = req.headers["x-access-token"];

  // console.log(decode);
  try {
    const decode = jwt.verify(token, secret);
    const userId = decode._id;

    const user = await User.findOne(userId);
    const transactions = await Transaction.find({ userId: userId });
    return res.json({ status: "ok", user: user, transactions: transactions });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

//   async (req, res) => {
//     const token = req.headers["x-access-token"];

//     try {
//       const decode = jwt.verify(token, secret);
//       const userId = decode._id;

//       const user = await User.findOne({ id: userId });
//       console.log(res.json({ status: "ok", data: user }));
//       return res.json({ status: "ok", data: user });
//     } catch (error) {
//       console.log(error);
//       res.json({ status: "error", error: "invalid_token" });
//     }
//   };
// app.get("/users", async (req, res) => {
//   try {
//     const users = await User.find().populate("transactions");
//     res.json(users);
//   } catch (error) {
//     res.status(500).json({ error: "Error fetching users" });
//   }
// });
// app.post("/api/transaction", async (req, res) => {
//   try {
//     const decode = jwt.verify(token, secret);
//     console.log(decode);
//     const email = decode.email;
//     const { name, price, description, datetime } = req.body;

//     const transaction = await Transaction.create({
//       price,
//       name,
//       description,
//       datetime,
//     }); //create object to stroe in db

//     res.json(transaction);
//   } catch (error) {
//     console.error("Error adding transaction:", error);
//     return res.status(500).json({ error: "Internal server error" });
//   }
// });

// app.post("/api/user/:userId/transaction", async (req, res) => {
//   try {
//     const { price, name, description, datetime } = req.body; // client side

//     const userId = req.params._id;
//     const newTransaction = await Transaction.create({
//       price,
//       name,
//       description,
//       datetime,
//     }); //create object to stroe in db
//     const user = await User.findById(userId);
//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     user.transactions.push(newTransaction._id);

//     // Save the updated user with the new transaction reference
//     await user.save();

//     // Save the new transaction to the database
//     await newTransaction.save();

//     return res.status(201).json({ message: "Transaction added successfully" });
//   } catch (error) {
//     console.error("Error adding transaction:", error);
//     return res.status(500).json({ message: "Internal server error" });
//   }
// });

//-----------------------ORIGINAL-----------------------------
// app.post("/api/transaction", async (req, res) => {
//   await mongoose.connect(
//     "mongodb+srv://AdminAkansh:Admin@clusterakansh.734wjwt.mongodb.net/FinTrack"
//   );

//   const { price, name, description, datetime } = req.body; // client side

//   const transaction = await Transaction.create({
//     price,
//     name,
//     description,
//     datetime,
//   }); //create object to stroe in db

//   res.json(transaction);
// });

app.get("/api/transactions", async (req, res) => {
  await mongoose.connect(
    "mongodb+srv://AdminAkansh:Admin@clusterakansh.734wjwt.mongodb.net/FinTrack"
  );

  const transactions = await Transaction.find({}); //grab all of those
  res.json(transactions);
});

app.delete("/api/transaction/:userId/:transactionId", async (req, res) => {
  const { userId, transactionId } = req.params;
  console.log(userId);
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

    // Delete the transaction from the Transaction collection
    await Transaction.findByIdAndDelete(transactionId);

    // Remove the transaction ID from the user's transactions array
    user.transactions.pull(transactionId);
    await user.save();

    res.json({ status: "ok", message: "Transaction deleted successfully" });
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
