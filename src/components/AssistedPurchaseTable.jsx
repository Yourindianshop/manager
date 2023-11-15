import React, { useContext, useEffect, useState } from "react";
import "../stylesheet/ProductAcceptanceTable.css";
import { fetchreq, getDate } from "../Helper/fetch";
import { MyContext } from "../App";

const assistedPurchaseData = [
  {
    requestId: "1",
    customerName: "John Doe",
    customerEmail: "john.doe@example.com",
    productName: "Product A",
    productDescription:
      "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Autem ratione iure quo velit inventore harum? Maiores suscipit cupiditate fugiat cum pariatur voluptate officia voluptatum, totam ipsam beatae sunt nobis commodi modi laboriosam, odit consectetur necessitatibus.",
    productImage:
      "https://idcardgenrator.s3.ap-northeast-1.amazonaws.com/Curior-service/shipping-site-imgs/product/btt1.webp",
    requestTimestamp: "2023-08-27 10:30 AM",
  },
  {
    requestId: "2",
    customerName: "Alice Smith",
    customerEmail: "alice.smith@example.com",
    productName: "Product B",
    productDescription:
      "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Qui aliquid laboriosam neque vero quae, doloribus soluta reprehenderit atque, ducimus aspernatur enim ratione perferendis, repellendus nesciunt molestiae magnam tempora veritatis quidem?",
    productImage:
      "https://idcardgenrator.s3.ap-northeast-1.amazonaws.com/Curior-service/shipping-site-imgs/product/btt2.webp",
    requestTimestamp: "2023-08-26 02:45 PM",
  },
  {
    requestId: "3",
    customerName: "Bob Johnson",
    customerEmail: "bob.johnson@example.com",
    productName: "Product C",
    productDescription:
      "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Nemo libero exercitationem voluptates autem ea, ipsam aperiam eaque quod facere, nihil cum molestiae labore suscipit qui a ut. Similique, unde velit.",
    productImage:
      "https://idcardgenrator.s3.ap-northeast-1.amazonaws.com/Curior-service/shipping-site-imgs/product/btt3.webp",
    requestTimestamp: "2023-08-25 08:15 AM",
  },
  {
    requestId: "4",
    customerName: "Emily Davis",
    customerEmail: "emily.davis@example.com",
    productName: "Product D",
    productDescription:
      "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Voluptatem nam tempora, ullam vero, magni dolorem quia quod nobis consequatur perspiciatis iusto labore quo cumque obcaecati atque aut! Natus, quas optio.",
    productImage:
      "https://idcardgenrator.s3.ap-northeast-1.amazonaws.com/Curior-service/shipping-site-imgs/product/btt4.webp",
    requestTimestamp: "2023-08-24 04:20 PM",
  },

  // Add more dummy objects here...
];

const AssistedPurchaseTable = () => {
  const [filteredData, setFilteredData] = useState(assistedPurchaseData);
  const [timeFilter, setTimeFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [APR,setAPR]=useState(null);
  const {mg}=useContext(MyContext);
  const url = process.env.REACT_APP_URL

  // Function to handle time filter change
  const handleTimeFilterChange = (e) => {
    const newTimeFilter = e.target.value;
    setTimeFilter(newTimeFilter);

    // Apply time filter on the data
    const filteredDataWithTime = applyTimeFilter(filteredData, newTimeFilter);

    // Apply search query on the newly filtered data
    const finalFilteredData = applySearchFilter(
      filteredDataWithTime,
      searchQuery
    );

    setFilteredData(finalFilteredData);
  };

  // Function to handle search query change
  const handleSearchQueryChange = (e) => {
    const newSearchQuery = e.target.value;
    setSearchQuery(newSearchQuery);

    // Apply search query on the data
    const finalFilteredData = applySearchFilter(filteredData, newSearchQuery);

    setFilteredData(finalFilteredData);
  };

  // Function to apply time filter
  const applyTimeFilter = (data, timeFilter) => {
    if (timeFilter === "All") return data;

    const today = new Date();
    const oneDay = 24 * 60 * 60 * 1000;

    const filteredData = data.filter((request) => {
      const requestDate = new Date(request.requestTimestamp);
      const daysDifference = Math.floor((today - requestDate) / oneDay);
      return timeFilter === "7Days"
        ? daysDifference <= 7
        : daysDifference <= 30;
    });

    return filteredData;
  };

  // Function to apply search query filter
  const applySearchFilter = (data, searchQuery) => {
    if (!searchQuery) return data; // If searchQuery is empty, return all data

    const lowerCaseQuery = searchQuery.toLowerCase();
    const filteredData = data.filter((request) =>
      request.requestId.toLowerCase().includes(lowerCaseQuery)
    );

    return filteredData;
  };
  const getData = async ()=>{
    const wid = mg?.Wid;
    const dt = await fetchreq("GET","getAPRManager",{});
    dt?setAPR(dt.result):setAPR([]);
  }
  useEffect(()=>{
    getData();
  })
  return (
    <div className="assisted-purchase-container">
      {/* <div className="filters">
        <div className="filter-title">Filter</div>
        <div className="filter-tab">
          <div className="filter-item">
            <label>Time:</label>
            <select value={timeFilter} onChange={handleTimeFilterChange}>
              <option value="All">All</option>
              <option value="7Days">Last 7 Days</option>
              <option value="30Days">Last 30 Days</option>
            </select>
          </div>
          <div className="filter-item">
            <input
              placeholder="Search by Request ID"
              type="text"
              value={searchQuery}
              onChange={handleSearchQueryChange}
            />
          </div>
        </div>
      </div> */}
      <br />
      <table className="assisted-purchase-table">
        <thead>
          <tr>
            <th>Request ID</th>
            <th>Customer ID</th>
            <th>Name</th>
            <th>Brand</th>
            <th>Description</th>
            <th>Other Info</th>
            <th>Image</th>
            <th>Request Time</th>
          </tr>
        </thead>
        <tbody>
          {APR && APR.map((request, index) => (
            <tr key={index} className="asr-row">
              <td>{request.Aid}</td>
              <td>{request.email}</td>
              <td>{request.Name}</td>
              <td>{request.Brand}</td>
              <td>
                <div className="desc-pro">{request.Description}</div>
              </td>
              <td>{request.Other}</td>
              <td>
                <img
                  src={`${url}/${request.Images}`}
                  className="asr-photo"
                  alt="Product"
                />
              </td>
              <td>{getDate(request.time)}</td>
            </tr>
          ))}
        </tbody>
        {!APR && <p>Loading...</p> }
        {APR && APR.lenght==0 && <p>No Data Found...</p> }
      </table>
    </div>
  );
};

export default AssistedPurchaseTable;
