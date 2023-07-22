import React from "react";
import { useEffect, useState } from "react";
// import Config from "./Config.json";

import Config from "../Config.json";
import { useNavigate } from "react-router-dom";
import DeleteIcon from "@mui/icons-material/Delete";
import { IconButton } from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import FlipMove from "react-flip-move";
import { toast } from "react-toastify";
// import jwt from "jsonwebtoken";
function Transaction() {
  const [name, setName] = useState("");
  const [datetime, setDatetime] = useState("");
  const [description, setDescription] = useState("");
  const [refresh, setRefresh] = useState(false);

  const toggleRefresh = () => {
    setRefresh(!refresh);
  };

  const [user, setUser] = useState("");
  const [transactionData, setTransactionData] = useState([]);
  const [loading, setLoading] = useState(true);
  // console.log(user);
  // console.log(user.id);

  const userId = user.id;
  const navigate = useNavigate();
  // console.log(transactionData);
  // console.log(transactionData);

  const token = localStorage.getItem("token");
  // console.log(token);

  // useEffect(() => {
  //   getTransactions();
  // }, [refresh]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    // console.log(token);

    if (token) {
      const user = JSON.parse(window.atob(token.split(".")[1]));
      // console.log(user);
      setUser(user);
      if (!user) {
        localStorage.removeItem("token");
        navigate("/");
      } else {
        getTransactions(userId);
      }
    }
  }, [refresh]);

  // console.log(refresh);
  // const getUser = async () => {};

  // const getTransactions = async () => {
  //   const url = Config.API_URL + "/transactions";
  //   console.log(url);
  //   try {
  //     const response = await fetch(url, {
  //       headers: {
  //         "x-access-token": localStorage.getItem("token"),
  //       },
  //     });
  //     if (!response.ok) {
  //       throw new Error("Network response was not ok");
  //     }
  //     const data = await response.json();
  //     console.log(data);
  //     if (data.status === "ok") {
  //       // Handle success, e.g., update UI or display a success message
  //       navigate("/transaction");
  //     }
  //     console.log(data.user._id);
  //     setUser(data.user);
  //     setTransactionData(data.transactions);
  //     setLoading(false);
  //   } catch (error) {
  //     console.error("Error fetching data:", error.message);
  //     return []; // Return an empty array or handle the error appropriately.
  //   }
  // };
  // #MODIFY work on ui

  // const addNewTransaction = async (e) => {
  //   e.preventDefault();

  //   const url = Config.API_URL + "/transaction";
  //   const price = name.split(" ")[0];
  //   const nameT = name.substring(price.length + 1);
  //   console.log(nameT);
  //   const actualDate = datetime.slice(0, 10);
  //   console.log(actualDate);

  //   // Check if the "nameT" value is empty before making the API call
  //   if (!nameT.trim()) {
  //     console.error("Name is required.");
  //     return;
  //   }

  //   const req = await fetch(url, {
  //     method: "POST",
  //     headers: {
  //       "Content-Type": "application/json",
  //       "x-access-token": localStorage.getItem("token"),
  //     },
  //     body: JSON.stringify({
  //       price,
  //       name: nameT,
  //       description,
  //       datetime: actualDate,
  //     }),
  //   });
  //   const data = await req.json();
  //   console.log(data);
  //   if (data.status === "ok") {
  //     setName("");
  //     setDescription("");
  //     setDatetime("");
  //     toggleRefresh();
  //   } else {
  //     console.log(data.error);
  //   }
  // };

  //--------------START-------------------------

  var currentdate = new Date();
  var DateTime =
    currentdate.getDay() +
    "-" +
    currentdate.getMonth() +
    "-" +
    currentdate.getFullYear() +
    " @ " +
    currentdate.getMinutes() +
    ":" +
    currentdate.getHours();

  console.log(DateTime);

  const addNewTransaction = async (e) => {
    e.preventDefault();

    const url = Config.API_URL + "/add-transaction";
    const price = name.split(" ")[0];
    const nameT = name.substring(price.length + 1);
    // console.log(nameT);
    const actualDate = datetime.slice(0, 10);
    // console.log(actualDate);

    // Check if the "nameT" value is empty before making the API call
    if (!nameT.trim()) {
      console.error("Name is required.");
      return;
    }

    const req = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-access-token": localStorage.getItem("token"),
      },
      body: JSON.stringify({
        price,
        name: nameT,
        description,
        datetime: actualDate || DateTime,
      }),
    });

    const data = await req.json();

    // console.log(data);
    if (data.status === "ok") {
      setName("");
      setDescription("");
      setDatetime("");
      toggleRefresh();
    } else {
      console.log(data.error);
    }
  };
  //---------------------------
  const getTransactions = async (userId) => {
    const url = Config.API_URL + `/user-transactions/${userId}`;
    // console.log(url);
    try {
      const response = await fetch(url, {
        headers: {
          "Content-Type": "application/json",
          "x-access-token": localStorage.getItem("token"),
        },
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();

      // console.log(transactionData);
      if (data.status === "ok") {
        // Handle success, e.g., update UI or display a success message
        // navigate("/transaction");
        setTransactionData(data?.transactions);
        setLoading(false);
        // setRefresh(!refresh);
      }
      // console.log(data.user._id);
      // setUser(data.user);
    } catch (error) {
      console.error("Error fetching data:", error.message);
      return []; // Return an empty array or handle the error appropriately.
    }
  };

  //---------------END------------------------

  // console.log(transactionData);

  const deleteTransaction = async (transactionId) => {
    console.log(transactionId);
    try {
      const url = `${Config.API_URL}/transactions/${transactionId}`;

      const response = await fetch(url, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "x-access-token": localStorage.getItem("token"),
        },
      });
      console.log(response.ok);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error);
      }
      // getTransactions(userId);
      const data = await response.json();
      // console.log(data.status);

      if (data.status === "ok") {
        // Handle success, e.g., update UI or display a success message
        navigate("/transaction");
        setRefresh(!refresh);
      } else {
        // Handle error, e.g., display an error message
      }
    } catch (error) {
      console.error("Error while deleting the transaction:", error);
    }
  };

  var balance = 0;
  for (
    let transaction = 0;
    transaction < transactionData?.length;
    transaction++
  ) {
    balance = balance + transactionData[transaction]?.price;
    // console.log(balance);
  }
  balance = parseFloat(balance).toFixed(2);

  const paise = balance.split(".")[1];

  balance = balance.split(".")[0];

  const logoutUser = () => {
    localStorage.removeItem("token");
    toast.success("Logout Successfully");
    navigate("/");
  };
  return (
    <>
      <main>
        <div className="user">
          <h4>{user?.name}</h4>
          <h4>{user?.email}</h4>
        </div>
        <h1>
          ₹ {balance ? balance : 0}
          <span>.{paise}</span>
        </h1>
        <div className="logout">
          <IconButton aria-label="delete" size="large" onClick={logoutUser}>
            <LogoutIcon
              fontSize="inherit"
              color="secondary"
              sx={{ color: "#2aa996" }}
            />
          </IconButton>
        </div>
        {/* <button onClick={logoutUser}>Logout</button> */}
        <form action="" onSubmit={addNewTransaction}>
          <div className="basics">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="+200<space>Rent"
            />
            <input
              type="datetime-local"
              name=""
              value={datetime}
              onChange={(e) => setDatetime(e.target.value)}
              id=""
            />
          </div>
          <div className="description">
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="description"
            />
          </div>
          <button type="submit">Add new Transaction</button>
        </form>

        <div className="transactions">
          <FlipMove>
            {transactionData &&
              transactionData.map((item, index) => {
                return (
                  <div key={index}>
                    <div className="transaction">
                      <div className="data">
                        <div className="left">
                          <div className="name">{item?.name}</div>
                          <div className="description">{item?.description}</div>
                        </div>
                        <div className="right">
                          <div
                            className={
                              "price " + (item?.price < 0 ? "red" : "green")
                            }
                          >
                            {item?.price}
                          </div>
                          <div className="datetime">
                            {item?.datetime?.slice(0, 10)}
                          </div>
                        </div>
                      </div>
                      <div className="delete">
                        {/* {console.log(userId)} */}
                        {console.log("Transaction ID : " + item?._id)}

                        <IconButton
                          aria-label="delete"
                          size="small"
                          onClick={() => {
                            deleteTransaction(item?._id);
                            setRefresh(!refresh);
                          }}
                        >
                          <DeleteIcon color="error" />
                        </IconButton>
                      </div>
                    </div>
                  </div>
                );
              })}
          </FlipMove>
        </div>
      </main>
    </>
  );
}

export default Transaction;