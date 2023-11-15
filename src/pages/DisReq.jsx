import React, { useContext, useEffect, useState } from "react";
import "../stylesheet/DisReq.css";
import DispatchRequestTable from "../components/DispatchRequestTable";
import { useNavigate } from "react-router-dom";
import { MyContext } from "../App";
import PacketesTable from "../components/PacketesTable";
const DisReq = () => {
  const nav = useNavigate();
  const {mg,isLogin}=useContext(MyContext);
  const [showpkt,setShowpkt]=useState(false)
  useEffect(()=>{
    if(!isLogin){
      nav("/");
    }
  },[])
  return (
    <>
      <div id="dr-cont">
        <div id="dash-title">
          <span id="blue">Dispatch</span>
          <span id="org">Request</span>
          <span id="blue">Section</span>
        </div>
        <button className="btn btn-b" onClick={()=>setShowpkt(!showpkt)} style={{position:'absolute',right:"0px",width:'200px'}}>Show {showpkt?"Dispatch Requests":"Packets"}</button>
        {!showpkt ? <DispatchRequestTable /> : <PacketesTable/>}
      </div>
    </>
  );
};

export default DisReq;
