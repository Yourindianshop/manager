import React, { createContext, useEffect, useState } from "react";
import Sidebar from "./components/Sidebar";
import "./App.css";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import AssistedPurchase from "./pages/AssistedPurchase";
import Dashboard from "./pages/Dashboard";
import Customers from "./pages/Customers";
import DisReq from "./pages/DisReq";
import PrintDisDoc from "./pages/PrintDisDoc";
import SignIn from "./pages/SignIn";
import ProAccReq from "./pages/ProAccReq";
import AccRqInfo from "./components/AccRqInfo";
import DisRqInfo from "./components/DisReqInfo";
export const MyContext = createContext();
const App = () => { 
  const [rd,setRd]=useState(null);
  const [dr,setDr]=useState(null);
  const [savedt,setSavedt]=useState(null);
  const [savedt2,setSavedt2]=useState(null);
  const [savedt3,setSavedt3]=useState(null);
  const [mg,setMg]=useState({Wid:3});
  const [isLogin,setIsLogin]=useState(false);
  const [ispen,setIspen]=useState(true);
  useEffect(()=>{
    setInterval(()=>{
      setSavedt(null);
      setSavedt2(null);
      setSavedt3(null);
    },120000);
  },[])
  return (
    <MyContext.Provider value={{
      rd,setRd,
      savedt,setSavedt,
      savedt2,setSavedt2,
      savedt3,setSavedt3,
      mg,setMg,
      isLogin,setIsLogin,
      ispen,setIspen,
      dr,setDr
    }}>
     <Router>
      <div id="app" className="row">
          {isLogin && <Sidebar />}
        <main>
          <Routes>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/product-acceptance" element={<ProAccReq/>} />
            <Route path="/par-info" element={<AccRqInfo/>} />
            <Route path="/dispatch-info" element={<DisRqInfo/>} />
            <Route path="/customers" element={<Customers/>} />
            <Route path="/dispatch-req" element={<DisReq/>} />
            <Route path="/assisted-purchase" element={<AssistedPurchase/>} />
            <Route path="/print-dis-doc" element={<PrintDisDoc/>} />
            <Route path="/manager" element={<SignIn/>} />
            <Route path="/" element={<SignIn/>} />
          </Routes>
        </main>
      </div>
      {/* <div id="app" className="row">
        <aside>
          <Sidebar />
        </aside>
        <main>
            <Home />
     
        </main>
      </div> */}
    </Router>
    </MyContext.Provider>
  );
};

export default App;