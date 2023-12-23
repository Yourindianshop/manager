import React, { useContext, useEffect, useState } from "react";
import "../stylesheet/DispatchRequestTable.css";
import { fetchreq, getDate } from "../Helper/fetch";
import { MyContext } from "../App";
import { useNavigate } from "react-router-dom";



const DispatchRequestTable = () => {
  const {setRd,savedt2,setSavedt2,ispen,setIspen,dr,setDr,mg}=useContext(MyContext);
  // const [filteredData, setFilteredData] = useState(dispatchRequestData);
  // const [lockerNumberFilter, setLockerNumberFilter] = useState("All");
  // const [searchQuery, setSearchQuery] = useState("");
  const [Ddt,setDdt]=useState(null);
  const [apr,setApr]=useState(null);
  const [pnd,setpnd]=useState(null);

  const nav = useNavigate();
  {// const handleLockerNumberFilterChange = (e) => {
  //   const newLockerNumberFilter = e.target.value;
  //   setLockerNumberFilter(newLockerNumberFilter);
  //   const filteredDataWithLocker = dispatchRequestData.filter(
  //     (request) =>
  //       newLockerNumberFilter === "All" ||
  //       request.lockerNumber === newLockerNumberFilter
  //   );
  //   setFilteredData(filteredDataWithLocker);
  // };

  // const handleSearchQueryChange = (e) => {
  //   const newSearchQuery = e.target.value;
  //   setSearchQuery(newSearchQuery);
  //   const finalFilteredData = applySearchFilter(filteredData, newSearchQuery);
  //   setFilteredData(finalFilteredData);
  // };

  // const applySearchFilter = (data, searchQuery) => {
  //   if (!searchQuery) return data;
  //   const lowerCaseQuery = searchQuery.toLowerCase();
  //   return data.filter((request) =>
  //     request.dispatchRequestId.toLowerCase().includes(lowerCaseQuery)
  //   );
  // };
}
const getApproved = async (dt)=>{
  document.getElementById('p1').classList.remove("btn-b");
  document.getElementById('a1').classList.add("btn-b");
  const ap =await dt.filter((k)=>k?.isMul!=null);
  setApr(ap);
  setIspen(false);
}
const getPendings =async (dt)=>{
  document.getElementById('a1').classList.remove("btn-b");
  document.getElementById('p1').classList.add("btn-b");
  const pen =await dt.filter((k)=>k?.isMul==null);
  setIspen(true);
  setpnd(pen);
} 
const getData=async ()=>{
  const dt  = await fetchreq("GET",`dispachreq/${mg?.Wid}`);
  if(dt){
    await setDdt(dt.result);
    getPendings(dt.result);
    // setSavedt2(dt.result);
  }else{
    setDdt([]);
  }
}
const viewMore = async (req)=>{
  setDr(req);
  setTimeout(() => {
    nav("/dispatch-info");
  }, 500);  
}
useEffect(()=>{
  if(savedt2!=null){
    setDdt(savedt2);
    console.log(ispen)
    if(ispen){
      getPendings(savedt2);
    }else{
      getApproved(savedt2);
    }
  }else{
    getData();
  }
},[])
  return (
    <div className="dispatch-request-container product-acceptance-container">
      {/* <div className="filters">
        <div className="filter-title">Filter</div>
        <div className="filter-tab">
          <div className="filter-item">
            <label>Locker Number:</label>
            <select
              value={lockerNumberFilter}
              onChange={handleLockerNumberFilterChange}
            >
              <option value="All">All</option>
              {[
                ...new Set(
                  dispatchRequestData.map((request) => request.lockerNumber)
                ),
              ].map((lockerNumber) => (
                <option key={lockerNumber} value={lockerNumber}>
                  {lockerNumber}
                </option>
              ))}
            </select>
          </div>
          <div className="filter-item">
            <input
              placeholder="Search by Dispatch Request ID"
              type="text"
              value={searchQuery}
              onChange={handleSearchQueryChange}
            />
          </div>
        </div>
      </div> */}
      <div>
        

      </div>
      <div style={{display:'flex'}}>
        <button id="p1" onClick={()=>getPendings(Ddt)} className="btn ">Single Dispach Req</button>
        <button id="a1" onClick={()=>getApproved(Ddt)} className="btn ">Multiple Dispach Req</button>
      </div>
      <table className="dispatch-request-table">
        <thead>
          <tr>
            <th>Id</th>
            <th>ProductId</th>
            <th>Reciver</th>
            <th>email</th>
            <th>City</th>
            <th>State</th>
            <td>Country</td>
            <td>Pincode</td>
            <th>Date</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          { Ddt && pnd.map((request, index) => (
            <tr key={index} id="rr">
              <td>{request.Sid}</td>
              <td>{request.Did}</td>
              <td>{request.Name}</td>
              <td>{request.Email}</td>
              <td>{request.City}</td>
              <td>{request.State}</td>
              <td>{request.Country}</td>
              <td>{request.pincode}</td>
              <td>{getDate(request.Time)}</td>
              <td>{request.Status==1?"Seen":"Pending"}</td>
              <td>
                <button className="btn btn-o" onClick={()=>viewMore(request)} >View More</button>
              </td>
            </tr>
          ))}
          {/* {!ispen && Ddt && apr.map((request, index) => (
            <tr key={index} id="rr">
              <td>{request.Sid}</td>
              <td>{request.Did}</td>
              <td>{request.Name}</td>
              <td>{request.Email}</td>
              <td>{request.City}</td>
              <td>{request.State}</td>
              <td>{request.Country}</td>
              <td>{request.pincode}</td>
              <td>{getDate(request.Time)}</td>
              <td>{request.Status==1?"Seen":"Pending"}</td>
              <td>
                <button className="btn btn-o" onClick={()=>viewMore(request)} >View More</button>
              </td>
            </tr>
          ))} */}
          {!Ddt && <p>Loading</p> }
          {Ddt && Ddt.length==0 && <p>No data found...</p> }
        </tbody>
      </table>
    </div>
  );
};

export default DispatchRequestTable;
