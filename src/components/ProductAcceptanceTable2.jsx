import React, { useContext, useEffect, useState } from "react";
import "../stylesheet/ProductAcceptanceTable.css";
import { useNavigate } from "react-router-dom";
import { fetchreq, getDate } from "../Helper/fetch";
import { MyContext } from "../App";

const ProductAcceptanceTable = () => {
  //
  const { setRd, savedt3, setSavedt3, ispen, setIspen, mg } =
    useContext(MyContext);
  const [pad, setPad] = useState(null);
  const [apr, setApr] = useState(null);
  const [pnd, setpnd] = useState(null);
  const nav = useNavigate();

  const itemsPerPage = 2; // Adjust as needed
  const [currentPage, setCurrentPage] = useState(1);

  const dataToDisplay = ispen ? pnd : apr;
  const totalItems = dataToDisplay ? dataToDisplay.length : 0;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = dataToDisplay
    ? dataToDisplay.slice(startIndex, endIndex)
    : [];

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const getDate = (time) => {
    // Implement your getDate logic here
    return time; // Placeholder, replace with your actual logic
  };

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

  const getApproved = async (dt) => {
    document.getElementById("p1").classList.remove("btn-b");
    document.getElementById("a1").classList.add("btn-b");
    const ap = await dt.filter((k) => k?.Verify == 1);
    setApr(ap);
    setIspen(false);
  };
  const getPendings = async (dt) => {
    document.getElementById("a1").classList.remove("btn-b");
    document.getElementById("p1").classList.add("btn-b");
    const pen = await dt.filter((k) => k?.Verify != 1);
    setpnd(pen);
    setIspen(true);
  };
  const viewmore = async (r) => {
    setRd(r);
    setTimeout(() => {
      nav("/par-info");
    }, 500);
  };
  const getData = async () => {
    const dt = await fetchreq("GET", `getPARP/${mg?.Wid}`, {});
    if (dt) {
      setPad(dt.result);
      getPendings(dt.result);
      // setSavedt3(dt.result);
    } else {
      setPad(null);
    }
  };
  useEffect(() => {
    if (savedt3 != null) {
      setPad(savedt3);
      if (ispen) {
        getPendings(savedt3);
      } else {
        getApproved(savedt3);
      }
    } else {
      getData();
    }
  }, []);

  return (
    <div className="product-acceptance-container">
      <div style={{ display: "flex" }}>
        <button id="p1" onClick={() => getPendings(pad)} className="btn ">
          Pending
        </button>
        <button id="a1" onClick={() => getApproved(pad)} className="btn ">
          Approved
        </button>
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
          {currentItems.map((request, index) => {
            const time = getDate(request.time);
            const status = request.Verify === 0 ? "Pending" : "Approved";

            return (
              <tr key={index} id="rr">
                <td>{request.Rid}</td>
                <td>{request.email}</td>
                <td>{request.productName}</td>
                <td>{time}</td>
                <td className={request.status}>{status}</td>
                <td>
                  {request.RenewIn === -1 ? "Free" : request.RenewIn + " Days"}
                </td>
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

          {dataToDisplay && dataToDisplay.length === 0 && <p>No data found</p>}
          {!dataToDisplay && <p>Loading...</p>}
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

export default ProductAcceptanceTable;
