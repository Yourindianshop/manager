import React, { useContext, useEffect, useState } from "react";
import "../stylesheet/DispatchRequestTable.css";
import { fetchreq, getDate } from "../Helper/fetch";
import { MyContext } from "../App";
import { useNavigate } from "react-router-dom";

const DispatchRequestTable = () => {
  const { setRd, savedt2, setSavedt2, ispen, setIspen, dr, setDr, mg } =
    useContext(MyContext);
  // const [filteredData, setFilteredData] = useState(dispatchRequestData);
  // const [lockerNumberFilter, setLockerNumberFilter] = useState("All");
  // const [searchQuery, setSearchQuery] = useState("");
  const [Ddt, setDdt] = useState(null);
  const [apr, setApr] = useState(null);
  const [pnd, setpnd] = useState(null);

  const itemsPerPage = 1; // Adjust as needed
  const [currentPage, setCurrentPage] = useState(1);

  // Assuming pnd is your data array
  const totalItems = Ddt ? Ddt.length : 0;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = Ddt ? Ddt.slice(startIndex, endIndex) : [];

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const getDate = (time) => {
    // Implement your getDate logic here
    return time; // Placeholder, replace with your actual logic
  };

  const nav = useNavigate();

  const getApproved = async (dt) => {
    document.getElementById("p1").classList.remove("btn-b");
    document.getElementById("a1").classList.add("btn-b");
    const ap = await dt.filter((k) => k?.isMul != null);
    setApr(ap);
    setIspen(false);
  };
  const getPendings = async (dt) => {
    document.getElementById("a1").classList.remove("btn-b");
    document.getElementById("p1").classList.add("btn-b");
    const pen = await dt.filter((k) => k?.isMul == null);
    setIspen(true);
    setpnd(pen);
  };
  const getData = async () => {
    const dt = await fetchreq("GET", `dispachreq/${mg?.Wid}`);
    if (dt) {
      await setDdt(dt.result);
      getPendings(dt.result);
      // setSavedt2(dt.result);
    } else {
      setDdt([]);
    }
  };
  const viewMore = async (req) => {
    setDr(req);
    setTimeout(() => {
      nav("/dispatch-info");
    }, 500);
  };
  useEffect(() => {
    if (savedt2 != null) {
      setDdt(savedt2);
      console.log(ispen);
      if (ispen) {
        getPendings(savedt2);
      } else {
        getApproved(savedt2);
      }
    } else {
      getData();
    }
  }, []);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };
  return (
    <div className="dispatch-request-container product-acceptance-container">
      <div></div>
      <div style={{ display: "flex" }}>
        <button id="p1" onClick={() => getPendings(Ddt)} className="btn ">
          Single Dispach Req
        </button>
        <button id="a1" onClick={() => getApproved(Ddt)} className="btn ">
          Multiple Dispach Req
        </button>
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
          {currentItems.map((request, index) => (
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
              <td>{request.Status === 1 ? "Seen" : "Pending"}</td>
              <td>
                <button className="btn btn-o" onClick={() => viewMore(request)}>
                  View More
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="dispatch-pagination-container">
        <button
          onClick={handlePrevPage}
          disabled={currentPage === 1}
          className="pagination-btn"
        >
          Previous
        </button>

        <span
          style={{ fontSize: "16px", fontWeight: "bold", margin: "5px 10px" }}
        >
          {` Page ${currentPage} of ${totalPages} `}
        </span>

        <button
          onClick={handleNextPage}
          disabled={currentPage === totalPages}
          className="pagination-btn"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default DispatchRequestTable;
