import React from "react";
import { useEffect, useState } from "react";
// import Config from "./Config.json";

import Config from "../Config.json";
import { useNavigate } from "react-router-dom";
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
  console.log(user);
  console.log(user._id);

  const userId = user._id;
  const navigate = useNavigate();
  console.log(transactionData);
  // console.log(transactionData);

  const token = localStorage.getItem("token");
  console.log(token);

  // useEffect(() => {
  //   getTransactions();
  // }, [refresh]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    console.log(token);

    if (token) {
      const user = JSON.parse(window.atob(token.split(".")[1]));
      console.log(user);
      setUser(user);
      if (!user) {
        localStorage.removeItem("token");
        navigate("/login");
      } else {
        getTransactions();
      }
    }
  }, [refresh]);

  console.log(refresh);
  const getUser = async () => {};

  const getTransactions = async () => {
    const url = Config.API_URL + "/transactions";
    console.log(url);
    try {
      const response = await fetch(url, {
        headers: {
          "x-access-token": localStorage.getItem("token"),
        },
      });
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      console.log(data);
      if (data.status === "ok") {
        // Handle success, e.g., update UI or display a success message
        navigate("/transaction");
      }
      console.log(data.user._id);
      setUser(data.user);
      setTransactionData(data.transactions);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error.message);
      return []; // Return an empty array or handle the error appropriately.
    }
  };
  // #MODIFY work on ui

  const addNewTransaction = async (e) => {
    e.preventDefault();

    const url = Config.API_URL + "/transaction";
    const price = name.split(" ")[0];
    const nameT = name.substring(price.length + 1);
    console.log(nameT);
    const actualDate = datetime.slice(0, 10);
    console.log(actualDate);

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
        datetime: actualDate,
      }),
    });
    const data = await req.json();
    console.log(data);
    if (data.status === "ok") {
      setName("");
      setDescription("");
      setDatetime("");
      toggleRefresh();
    } else {
      console.log(data.error);
    }
  };

  console.log(transactionData);

  const deleteTransaction = async (userId, transactionId) => {
    try {
      const url = `${Config.API_URL}/transaction/${userId}/${transactionId}`;

      const response = await fetch(url, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "x-access-token": localStorage.getItem("token"),
        },
      });

      const data = await response.json();
      console.log(data);

      if (data.status === "ok") {
        // Handle success, e.g., update UI or display a success message
        navigate("/transaction");
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
    navigate("/login");
  };
  return (
    <>
      <main>
        <h1>
          ₹ {balance ? balance : 0}
          <span>.{paise}</span>
        </h1>
        <button onClick={logoutUser}>Logout</button>
        <form action="" onSubmit={addNewTransaction}>
          <div className="basics">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="+200 new samsung tv"
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
          {transactionData &&
            transactionData.map((item, index) => {
              return (
                <div key={index}>
                  <div className="transaction">
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
                    <div>
                      {console.log(userId)}
                      {console.log(item?._id)}

                      <button
                        onClick={() => {
                          deleteTransaction(userId, item?._id);
                          setRefresh(!refresh);
                        }}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
      </main>
    </>
  );
}

export default Transaction;
