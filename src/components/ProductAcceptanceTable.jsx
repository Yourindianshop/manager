
import React, { useContext, useEffect, useState } from "react";
import "../stylesheet/ProductAcceptanceTable.css";
import {useNavigate} from 'react-router-dom'
import {fetchreq, getDate} from '../Helper/fetch'
import { MyContext } from "../App";

const ProductAcceptanceTable = () => {
  // 
  const {setRd,savedt,setSavedt,ispen,setIspen,mg}=useContext(MyContext);
  const [pad,setPad]=useState(null);
  const [apr,setApr]=useState(null);
  const [pnd,setpnd]=useState(null);
  const nav = useNavigate();
  
  // const getApproved = async (dt)=>{
  //   document.getElementById('p1').classList.remove("btn-b");
  //   document.getElementById('a1').classList.add("btn-b");
  //   const ap =await dt.filter((k)=>k?.Verify==1);
  //   setApr(ap);
  //   setIspen(false);
  // }
  // const getPendings =async (dt)=>{
  //   document.getElementById('a1').classList.remove("btn-b");
  //   document.getElementById('p1').classList.add("btn-b");
  //   const pen =await dt.filter((k)=>k?.Verify!=1);
  //   setpnd(pen);
  //   setIspen(true)
  // }
  const viewmore = async (r)=>{
    setRd(r);
    setTimeout(() => {
      nav("/par-info")
    }, 500);
  }
  const getData=async ()=>{
    console.log("Wid " +mg?.Wid);
    const dt = await fetchreq("GET",`getPAR/${mg?.Wid}?pg=1`,{});
    if(dt){
      setPad(dt.result);
      // getPendings(dt.result);
      // setSavedt(dt.result);
    }else{
      setPad(null);
    }
  }
  useEffect(()=>{
    if(savedt!=null ){
      setPad(savedt);
      if(ispen){
        setIspen(true);
      }else{
        setIspen(false);
      }
    }else{
      getData();
    }
  },[])
  
  return (
    <div className="product-acceptance-container">
      <div style={{display:'flex'}}>
        <button id="p1" onClick={()=>setIspen(true)} className={`btn ${ispen && "btn-b"} `}>Pending</button>
        <button id="a1" onClick={()=>setIspen(false)} className={`btn ${!ispen && "btn-b"} `}>Approved</button>
      </div>
      <table className="product-acceptance-table">
        <thead>
          <tr>
            <th>Request ID</th>
            <th>Customer ID</th>
            <th>Product Name</th>
            <th>Request Timestamp</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {pad && pad.length!=0 && pad.map((request, index) => {
            const time = getDate(request.time);
            const status = request.Verify!=1?"Pending":"Approved"
            let seen = false;
            if(ispen && request?.Verify!=1){
              seen = true
            }else if(!ispen && request?.Verify==1){
              seen = true
            }
            return (seen &&  <tr key={index} id="rr">
              <td>{request.Rid}</td>
              <td>{request.email}</td>
              <td>{request.productName}</td>
              <td>{time}</td>
              <td className={request.status}>{status}</td>
              <td>
                <button className="btn btn-o" onClick={()=>viewmore(request)}>View More</button>
              </td>
            </tr>
          )})}
          
          {!pad  && <h1>Loading...</h1> }
          {pad && pad.length==0 && <p>No data found</p> }
        </tbody>
      </table>
    </div>
  );
};

export default ProductAcceptanceTable;


//const [filteredData, setFilteredData] = useState([]);
  // const [statusFilter, setStatusFilter] = useState("All");
  // const [timeFilter, setTimeFilter] = useState("All");
  // const [searchQuery, setSearchQuery] = useState("");
  // Function to handle status filter change
  // const handleStatusFilterChange = (e) => {
  //   const newStatusFilter = e.target.value;
  //   setStatusFilter(newStatusFilter);

  //   // Filter the data based on status
  //   const filteredByStatus = productAcceptanceData.filter(
  //     (request) =>
  //       newStatusFilter === "All" || request.status === newStatusFilter
  //   );

  //   // Apply time filter on the newly filtered data
  //   const filteredDataWithTime = applyTimeFilter(filteredByStatus, timeFilter);

  //   // Apply search query on the newly filtered data
  //   const finalFilteredData = applySearchFilter(
  //     filteredDataWithTime,
  //     searchQuery
  //   );

  //   setFilteredData(finalFilteredData);
  // };

  // // Function to handle time filter change
  // const handleTimeFilterChange = (e) => {
  //   const newTimeFilter = e.target.value;
  //   setTimeFilter(newTimeFilter);

  //   // Apply time filter on the data
  //   const filteredDataWithTime = applyTimeFilter(filteredData, newTimeFilter);

  //   // Apply search query on the newly filtered data
  //   const finalFilteredData = applySearchFilter(
  //     filteredDataWithTime,
  //     searchQuery
  //   );

  //   setFilteredData(finalFilteredData);
  // };

  // // Function to handle search query change
  // const handleSearchQueryChange = (e) => {
  //   const newSearchQuery = e.target.value;
  //   setSearchQuery(newSearchQuery);

  //   // Apply search query on the data
  //   const finalFilteredData = applySearchFilter(filteredData, newSearchQuery);

  //   setFilteredData(finalFilteredData);
  // };

  // // Function to apply time filter
  // const applyTimeFilter = (data, timeFilter) => {
  //   if (timeFilter === "All") return data;

  //   const today = new Date();
  //   const oneDay = 24 * 60 * 60 * 1000;

  //   const filteredData = data.filter((request) => {
  //     const requestDate = new Date(request.requestTimestamp);
  //     const daysDifference = Math.floor((today - requestDate) / oneDay);
  //     return timeFilter === "7Days"
  //       ? daysDifference <= 7
  //       : daysDifference <= 30;
  //   });

  //   return filteredData;
  // };

  // // Function to apply search query filter
  // const applySearchFilter = (data, searchQuery) => {
  //   if (!searchQuery) return data; // If searchQuery is empty, return all data

  //   const lowerCaseQuery = searchQuery.toLowerCase();
  //   const filteredData = data.filter((request) =>
  //     request.requestId.toLowerCase().includes(lowerCaseQuery)
  //   );

  //   return filteredData;
  // };
  