import React, { useState } from "react";
import Config from "../Config.json";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  console.log(Config.API_URL);
  const registerUser = async (e) => {
    e.preventDefault();

    const response = await fetch(Config.API_URL + "/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json", // lots of type-binary,urlencoded
      },
      body: JSON.stringify({
        name,
        email,
        password,
      }),
    });
    const data = await response.json();
    console.log(data);
    console.log(data);

    if (data === "OK") {
      toast.success("Regestration Successful!!");
      navigate("/");
    } else if (data.status === "error") {
      toast.error("Duplicate Email Found!!");
      // alert("Duplicate Email");
    }
  };

  return (
    <>
      <div className="register">
        <div className="heading">
          <img src="\fintrack_transp.png" alt="" width={100} />
          <h2>Welcome to FinTrack</h2>
        </div>
        <div className="">
          <h1>Register</h1>
          <form action="" onSubmit={registerUser}>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Name"
            />
            <br />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
            />
            <br />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
            />
            <br />
            <button type="submit">Register</button>
          </form>
          <div className="no-account">
            <h5>Already have a FinTrack account ?</h5>
            <span>
              {" "}
              <Link to="/">Login</Link>{" "}
            </span>
          </div>
        </div>
      </div>
    </>
  );
}

export default Register;
