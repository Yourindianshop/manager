import React, { useContext, useEffect } from "react";
import ProductAcceptanceTable2 from "../components/ProductAcceptanceTable2";
import { useNavigate } from "react-router-dom";
import { MyContext } from "../App";
const Customers = () => {
  const nav = useNavigate();
  const {mg,isLogin}=useContext(MyContext);
  useEffect(()=>{
    if(!isLogin){
      nav("/");
    }
  },[])
  return (
    <div id="dr-cont">
      <div id="dash-title">
          <span id="blue">Plan Validity Wise</span>
          <span id="org">Request</span>
          <span id="blue">Section</span>
      </div>
      <ProductAcceptanceTable2  />
    </div>
  );
};

export default Customers;
