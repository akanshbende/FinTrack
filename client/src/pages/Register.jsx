import React, { useState } from "react";
import Config from "../Config.json";
import { useNavigate } from "react-router-dom";
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
      navigate("/login");
    } else if (data.status === "error") {
      alert("Duplicate Email");
    }
  };

  return (
    <>
      <div className="register">
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
      </div>
    </>
  );
}

export default Register;
