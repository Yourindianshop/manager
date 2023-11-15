import React, { useContext, useEffect } from "react";

import ProductAcceptanceTable from "../components/ProductAcceptanceTable";
import { useNavigate } from "react-router-dom";
import { MyContext } from "../App";
const ProAccReq = () => {
  const nav = useNavigate();
  const {mg,isLogin}=useContext(MyContext)
  useEffect(()=>{
    if(!isLogin){
      nav("/");
    }
  },[])
  return (
    <div id="dr-cont">
      <ProductAcceptanceTable />
    </div>
  );
};

export default ProAccReq;
