
import React, { useContext, useEffect, useState } from "react";
import "../stylesheet/ProductAcceptanceTable.css";
import {useNavigate} from 'react-router-dom'
import {fetchreq, getDate} from '../Helper/fetch'
import { MyContext } from "../App";

const ProductAcceptanceTable = () => {
  // 
  const {setRd,savedt3,setSavedt3,ispen,setIspen,mg}=useContext(MyContext);
  const [pad,setPad]=useState(null);
  const [apr,setApr]=useState(null);
  const [pnd,setpnd]=useState(null);
  const nav = useNavigate();
  
  const getApproved = async (dt)=>{
    document.getElementById('p1').classList.remove("btn-b");
    document.getElementById('a1').classList.add("btn-b");
    const ap =await dt.filter((k)=>k?.Verify==1);
    setApr(ap);
    setIspen(false);
  }
  const getPendings =async (dt)=>{
    document.getElementById('a1').classList.remove("btn-b");
    document.getElementById('p1').classList.add("btn-b");
    const pen =await dt.filter((k)=>k?.Verify!=1);
    setpnd(pen);
    setIspen(true)
  }
  const viewmore = async (r)=>{
    setRd(r);
    setTimeout(() => {
      nav("/par-info")
    }, 500);
  }
  const getData=async ()=>{
    const dt = await fetchreq("GET",`getPARP/${mg?.Wid}`,{});
    if(dt){
      setPad(dt.result);
      getPendings(dt.result);
      // setSavedt3(dt.result);
    }else{
      setPad(null);
    }
  }
  useEffect(()=>{
    if(savedt3!=null ){
      setPad(savedt3);
      if(ispen){
        getPendings(savedt3);
      }else{
        getApproved(savedt3)
      }
    }else{
      getData();
    }
  },[])
  
  return (
    <div className="product-acceptance-container">
      
      <div style={{display:'flex'}}>
        <button id="p1" onClick={()=>getPendings(pad)} className="btn ">Pending</button>
        <button id="a1" onClick={()=>getApproved(pad)} className="btn ">Approved</button>
      </div>
      <table className="product-acceptance-table">
        <thead>
          <tr>
            <th>Request ID</th>
            <th>Customer Id</th>
            <th>Product Name</th>
            <th>Request Timestamp</th>
            <th>Status</th>
            <th>Expire In</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {ispen && pnd && pnd.length!=0 && pnd.map((request, index) => {
            const time = getDate(request.time);
            const status = request.Verify==0?"Pending":"Approved"
            return ( <tr key={index} id="rr">
              <td>{request.Rid}</td>
              <td>{request.email}</td>
              <td>{request.productName}</td>
              <td>{time}</td>
              <td className={request.status}>{status}</td>
              <td>{request.RenewIn==-1?"Free":(request.RenewIn)+" Days"}</td>
              <td>
                <button className="btn btn-o" onClick={()=>viewmore(request)}>View More</button>
              </td>
            </tr>
          )})}
          {!ispen && apr && apr.length!=0 && apr.map((request, index) => {
            const time = getDate(request.time);
            const status = request.Verify==0?"Pending":"Approved"
            return ( <tr key={index} id="rr">
              <td>{request.Rid}</td>
              <td>{request.email}</td>
              <td>{request.productName}</td>
              <td>{time}</td>
              <td className={request.status}>{status}</td>
              <td>{request.RenewIn==-1?"Free":(request.RenewIn)+" Days"}</td>
              <td>
                <button className="btn btn-o" onClick={()=>viewmore(request)}>View More</button>
              </td>
            </tr>
          )})}
          {ispen && pnd && pnd.length==0 && <p>No data found</p> }
          {!ispen && apr &&  apr.length==0 && <p>No data found</p> }
          {!pad && <p>Loading...</p> }
        </tbody>
      </table>
    </div>
  );
};

export default ProductAcceptanceTable;