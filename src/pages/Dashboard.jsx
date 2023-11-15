import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchreq, jwtauth } from "../Helper/fetch";
import { MyContext } from "../App";

const Dashboard = () => {
  const [wh,setWh]=useState(null);
  const nav = useNavigate();
  const {mg,isLogin}=useContext(MyContext);
  const getData =async ()=>{
    const dt = await fetchreq("GET",`getWareSinglehouse/${mg?.Wid}`,{});
    dt?setWh(dt.result[0]):setWh(null);
  }
  useEffect(()=>{
    if(!isLogin){
      nav("/");
    }else{
      getData();
    }
  },[])
  return <div >
    
    <div id="par-cont">
      <div id="par-info">
        <p style={{color:"white"}}>Your Info </p>
        <div className="data-field">
          <div className="df-l">Manager Id</div>
          <div className="df-r">{mg?.Mid}</div>
        </div>
        <div className="data-field">
          <div className="df-l">Name</div>
          <div className="df-r">{mg?.Name}</div>
        </div>
        <div className="data-field">
          <div className="df-l">Email</div>
          <div className="df-r">{mg?.email}</div>
        </div>
        <div className="data-field">
          <div className="df-l">phone Number</div>
          <div className="df-r">{mg?.phoneNo}</div>
        </div>
        {wh && <><p style={{color:"white"}}>Your WareHouse </p>
        <div className="data-field">
          <div className="df-l">WareHouse Id</div>
          <div className="df-r">{wh?.Wid}</div>
        </div>
        <div className="data-field">
          <div className="df-l">WareHouse Name</div>
          <div className="df-r">{wh?.Name}</div>
        </div>
        <div className="data-field">
          <div className="df-l">Address Line 1</div>
          <div className="df-r">{wh?.Address}</div>
        </div>
        <div className="data-field">
          <div className="df-l">Address Line 2</div>
          <div className="df-r">{wh?.Address2}</div>
        </div>
        <div className="data-field">
          <div className="df-l">City</div>
          <div className="df-r">{wh?.City}</div>
        </div>
        <div className="data-field">
          <div className="df-l">Country</div>
          <div className="df-r">{wh?.Country}</div>
        </div>
        <div className="data-field">
          <div className="df-l">State</div>
          <div className="df-r">{wh?.State}</div>
        </div>
        <div className="data-field">
          <div className="df-l">pincode</div>
          <div className="df-r">{wh?.pincode}</div>
        </div>
        <div className="data-field">
          <div className="df-l">Capacity</div>
          <div className="df-r">{wh?.Capacity} Unit</div>
        </div>
        <div className="data-field">
          <div className="df-l">Status</div>
          <div className="df-r">{wh?.Status==1?"Working":"Off"}</div>
        </div></>}
      </div>
    </div>
  </div>;
};

export default Dashboard;
