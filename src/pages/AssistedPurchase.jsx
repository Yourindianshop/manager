import React, { useContext, useEffect } from "react";
import AssistedPurchaseTable from "../components/AssistedPurchaseTable";
import { useNavigate } from "react-router-dom";
import { MyContext } from "../App";

const AssistedPurchase = () => {
  const nav = useNavigate();
  const {mg,isLogin}=useContext(MyContext)
  useEffect(()=>{
    if(!isLogin){
      nav("/");
    }
  },[])
  return (
    <div id="dr-cont">
      <div id="dash-title">
        <div>
          <span id="blue">Assisted </span>
          <span id="org">Purchase </span>
          <span id="blue">Section </span>
        </div>
       
      </div>
      <div id="pd">
        <AssistedPurchaseTable />
      </div>
    </div>
  );
};

export default AssistedPurchase;

