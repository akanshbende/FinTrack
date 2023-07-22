import { useEffect, useState } from "react";
import Config from "./Config.json";
import "./App.css";
import Transaction from "./pages/Transaction";
import Register from "./pages/Register";
import Login from "./pages/Login";

import { BrowserRouter, Route, Routes } from "react-router-dom";
import DashBoard from "./pages/DashBoard";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route index element={<Register />} />
          <Route path="/transaction" element={<Transaction />} />
          <Route path="/dashboard" element={<DashBoard />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
