import React, { useState } from "react";
import Config from "../Config.json";
import { useNavigate } from "react-router-dom";
function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  console.log(Config.API_URL);
  const navigate = useNavigate();
  const loginUser = async (e) => {
    e.preventDefault();

    const response = await fetch(Config.API_URL + "/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json", // lots of type-binary,urlencoded
      },
      body: JSON.stringify({
        email,
        password,
      }),
    });
    const data = await response.json(); // if matched then
    if (data.user) {
      localStorage.setItem("token", data.user);
      alert("Login Successful");
      navigate("/transaction");
    } else {
      alert("Login Failed");
    }
    // console.log(data);
  };
  return (
    <>
      <div className="login">
        <h1>Login</h1>
        <form action="" onSubmit={loginUser}>
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
          <button type="submit">Login</button>
        </form>
      </div>
    </>
  );
}

export default Login;
