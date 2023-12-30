import React, { useContext, useEffect, useState } from "react";
import "../stylesheet/ProductAcceptanceTable.css";
import { useNavigate } from "react-router-dom";
import { fetchreq, getDate } from "../Helper/fetch";
import { MyContext } from "../App";

const ProductAcceptanceTable = () => {
  //
  const { setRd, savedt, setSavedt, ispen, setIspen, mg } =
    useContext(MyContext);
  const [pad, setPad] = useState(null);
  // const [apr,setApr]=useState(null);
  // const [pnd,setpnd]=useState(null);
  const nav = useNavigate();
  const [searchid, setSearchid] = useState(null);
  const [isSearchContinue, setIsSearchContinue] = useState(false);
  let alldata = null;
  const [totalReq, setTotalReq] = useState(null);
  const [isNext, setIsNext] = useState(true);
  const [isPrev, setIsprev] = useState(false);
  const pglimit = 2;
  const [totalpage, setTotalPage] = useState(1);
  const [pgNumber, setPgNumber] = useState(1);

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
  const viewmore = async (r) => {
    setRd(r);
    setTimeout(() => {
      nav("/par-info");
    }, 500);
  };
  const searchbyId = async () => {
    const dt = await fetchreq("GET", `searchPAR/${mg?.Wid}/${searchid}`, {});
    if (dt) {
      setIsSearchContinue(true);
      setPad(dt.result);
    } else {
      setIsSearchContinue(false);
    }
  };
  const getTotalRequest = async (ispen) => {
    let dt = await fetchreq(
      "GET",
      `requestCountPAR${ispen ? "P" : "A"}/${mg?.Wid}`,
      {}
    );
    if (dt) {
      let count = dt.result[0]?.count;
      let pgcount = Math.ceil(count / pglimit);
      setTotalReq(count);
      setTotalPage(pgcount);
      if (pgcount == 1) {
        setIsNext(false);
        setIsprev(false);
      } else {
        setIsNext(true);
        setIsprev(false);
      }
    }
  };
  const cancelSearch = async () => {
    setIsSearchContinue(false);
    getData(ispen, pgNumber);
  };
  const getData = async (isPending, pgNumber) => {
    // console.log("Wid " +mg?.Wid);
    setPad([]);
    const dt = await fetchreq(
      "GET",
      `getPAR${isPending ? "P" : "A"}/${mg?.Wid}/${pgNumber}`,
      {}
    );
    if (dt) {
      setPad(dt.result);
      alldata = dt.result;
      // getPendings(dt.result);
      // setSavedt(dt.result);
    } else {
      setPad(null);
    }
  };
  const loadPending = async () => {
    setIspen(true);
    getData(true, 1);
    setPgNumber(1);
    getTotalRequest(true);
  };
  const loadApr = async () => {
    setIspen(false);
    getData(false, 1);
    setPgNumber(1);
    getTotalRequest(false);
  };
  const goPrev = async () => {
    if (pgNumber - 1 > 0) {
      getData(ispen, pgNumber - 1);
      setPgNumber(pgNumber - 1);
      setIsNext(true);
      if (pgNumber - 1 == 1) {
        setIsprev(false);
      }
    } else {
      setIsprev(false);
    }
  };
  const goNext = async () => {
    if (pgNumber + 1 <= totalpage) {
      getData(ispen, pgNumber + 1);
      setPgNumber(pgNumber + 1);
      setIsprev(true);
      if (pgNumber + 1 == totalpage) {
        setIsNext(false);
      }
    } else {
      setIsNext(false);
    }
  };

  const handleNextPage = () => {
    if (pgNumber + 1 <= totalpage) {
      getData(ispen, pgNumber + 1);
      setPgNumber(pgNumber + 1);
      setIsprev(true);
      if (pgNumber + 1 === totalpage) {
        setIsNext(false);
      }
    } else {
      setIsNext(false);
    }
  };

  const handlePrevPage = () => {
    if (pgNumber - 1 > 0) {
      getData(ispen, pgNumber - 1);
      setPgNumber(pgNumber - 1);
      setIsNext(true);
      if (pgNumber - 1 === 1) {
        setIsprev(false);
      }
    } else {
      setIsprev(false);
    }
  };
  useEffect(() => {
    // if(savedt!=null ){
    //   setPad(savedt);
    //   alldata=savedt;
    //   if(ispen){
    //     setIspen(true);
    //   }else{
    //     setIspen(false);
    //   }
    // }else{
    //   getData();
    //   getTotalRequest();
    // }
    getData(ispen, pgNumber);
    getTotalRequest(ispen);
  }, []);

  return (
    <div className="product-acceptance-container">
      {!isSearchContinue && (
        <div style={{ display: "flex" }}>
          <button
            id="p1"
            onClick={loadPending}
            className={`btn ${ispen && "btn-b"} `}
          >
            Pending
          </button>
          <button
            id="a1"
            onClick={loadApr}
            className={`btn ${!ispen && "btn-b"} `}
          >
            Approved
          </button>
        </div>
      )}
      <div
        style={{
          display: "flex",
          justifyContent: !isSearchContinue ? "space-between" : "flex-end",
        }}
      >
        {!isSearchContinue && (
          <button
            style={{
              padding: "10px 15px",
              borderRadius: "5px",
              background: "#FF7D44",
              color: "#fff",
              border: "none",
              cursor: "pointer",
              boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
            }}
            onClick={() => getData(ispen, pgNumber)}
          >
            Refresh
          </button>
        )}

        <div style={{ display: "flex", alignItems: "center" }}>
          {isSearchContinue && (
            <button
              onClick={cancelSearch}
              className="btn-b"
              style={{
                marginLeft: "10px",
                padding: "10px 15px",
                borderRadius: "5px",
                background: "#e74c3c",
                color: "#fff",
                border: "none",
                cursor: "pointer",
                boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
              }}
            >
              Cancel Search
            </button>
          )}
          <input
            onChange={(e) => setSearchid(e.target.value)}
            value={searchid}
            min={1}
            placeholder="Search by Request Id"
            type="number"
            style={{
              padding: "8px",
              borderRadius: "5px",
              marginLeft: "10px",
              border: "1px solid #ccc",
            }}
          />
          <button
            disabled={searchid == null}
            onClick={searchbyId}
            className="btn-b"
            style={{
              marginLeft: "10px",
              padding: "10px 15px",
              borderRadius: "5px",
              background: "#3498db",
              color: "#fff",
              border: "none",
              cursor: searchid ? "pointer" : "not-allowed",
              boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
            }}
          >
            Search
          </button>
        </div>
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
          {pad &&
            pad.length != 0 &&
            pad.map((request, index) => {
              const time = getDate(request.time);
              const status = request.Verify != 1 ? "Pending" : "Approved";

              return (
                <tr key={index} id="rr">
                  <td>{request.Rid}</td>
                  <td>{request.email}</td>
                  <td>{request.productName}</td>
                  <td>{time}</td>
                  <td className={request.status}>{status}</td>
                  <td>
                    <button
                      className="btn btn-o"
                      onClick={() => viewmore(request)}
                    >
                      View More
                    </button>
                  </td>
                </tr>
              );
            })}

          {!pad && <h1>Loading...</h1>}
          {pad && pad.length === 0 && <p>No data found</p>}
        </tbody>
      </table>
      {totalpage !== 1 && !isSearchContinue && totalReq && (
        <div className="dispatch-pagination-container">
          <button
            onClick={handlePrevPage}
            disabled={!isPrev}
            className="pagination-btn"
          >
            Previous
          </button>
          <span
            style={{ fontSize: "16px", fontWeight: "bold", margin: "5px 10px" }}
          >
            {` Page ${pgNumber} of ${totalpage} `}
          </span>

          <button
            onClick={handleNextPage}
            disabled={!isNext}
            className="pagination-btn"
          >
            Next
          </button>
        </div>
      )}
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
