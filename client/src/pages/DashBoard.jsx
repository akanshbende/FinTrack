import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Config from "../Config.json";
// import * as jwt from "jsonwebtoken";
// import jwt from "jsonwebtoken";

function DashBoard() {
  const navigate = useNavigate();
  const [quote, setQuote] = useState("");
  const [tempQuote, setTempQuote] = useState("");
  console.log(tempQuote);

  const getTransaction = async () => {
    // event.preventDefault();

    const req = await fetch(Config.API_URL + "/quote", {
      //fetch is by-default GET request ,so no need to mention method:GET
      headers: { "x-access-token": localStorage.getItem("token") },
    });

    const data = await req.json();
    console.log(data);
    if (data.status === "ok") {
      setQuote(data.quote);
      console.log("DONEEEEE!!!!!!!!!!!");
    } else {
      console.log(data.error);
    }
  };

  const updateTransaction = async () => {
    // event.preventDefault();
    const req = await fetch(Config.API_URL + "/quote", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-access-token": localStorage.getItem("token"),
      },
      body: JSON.stringify({
        quote: tempQuote,
      }),
    });

    const data = await req.json();
    console.log(data);
    if (data.status === "ok") {
      setQuote("");
    } else {
      console.log(data.error);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    console.log(token);

    if (token) {
      // const user = jwt.decode(token);
      const user = JSON.parse(window.atob(token.split(".")[1]));
      console.log(user);
      if (!user) {
        localStorage.removeItem("token");
        navigate("/login");
      } else {
        getTransaction();
      }
    }
  }, []);

  return (
    <>
      <div className="dashboard">
        <h1>Your Quote : {quote || "No quotes!"}</h1>
        <form action="" onSubmit={updateTransaction}>
          <input
            type="text"
            placeholder="Quote.."
            value={tempQuote}
            onChange={(e) => setTempQuote(e.target.value)}
          />
          <input type="submit" value="Update quote" />
        </form>
      </div>
    </>
  );
}

export default DashBoard;
