import React, { useState } from "react";
import Config from "../Config.json";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  console.log(Config.API_URL);
  const navigate = useNavigate();
  const loginUser = async (e) => {
    e.preventDefault();

    try {
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
      console.log(data);

      if (data.status === "error" && data.error === "Invalid Login") {
        toast.error("Email Not Found !!");
      }

      if (data.user) {
        localStorage.setItem("token", data.user);
        // alert("Login Successful");
        toast.success("Login Successfull!!");
        navigate("/transaction");
      }
      if (data.user === false) {
        toast.error("Login Failed !!");
        // alert("Login Failed");
      }
    } catch (error) {
      console.log(error);
    }
    // console.log(data);
  };
  return (
    <>
      <div className="login">
        <div className="heading">
          <img src="\fintrack_transp.png" alt="" width={100} />
          <h2>Welcome to FinTrack</h2>
        </div>
        <div>
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
          <div className="no-account">
            <h5>Dont have FinTrack account ?</h5>
            <span>
              {" "}
              <Link to="/register">Register</Link>{" "}
            </span>
          </div>
        </div>
      </div>
    </>
  );
}

export default Login;
