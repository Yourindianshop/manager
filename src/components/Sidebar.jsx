import React, { useContext, useState } from "react";
import MenuOpenIcon from "@mui/icons-material/MenuOpen";
import "../stylesheet/Sidebar.css";
import DashboardOutlinedIcon from "@mui/icons-material/DashboardOutlined";
import LanguageOutlinedIcon from "@mui/icons-material/LanguageOutlined";
import InsertDriveFileOutlinedIcon from "@mui/icons-material/InsertDriveFileOutlined";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import { Link, useNavigate } from "react-router-dom";
import AddBusinessIcon from "@mui/icons-material/AddBusiness";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import { MyContext } from "../App";
const Sidebar = () => {
  const [isCollapsedSidebar, setisCollapsedSidebar] = useState(false);
  const {setIsLogin}=useContext(MyContext);
  const nav = useNavigate();

  const toggleSidebarCollapseHandler = () => {
    setisCollapsedSidebar((prev) => !prev);
    console.log(isCollapsedSidebar);
  };
  const logout = ()=>{
    window.localStorage.clear();
    setIsLogin(false);
    nav("/");
  }
  return (
    <>
      <aside data-collapse={isCollapsedSidebar}>
        <div id="side_nav">
          <header id="side_header" className="row">
            <span className="sidebar_nav_txt">
              <div className="logo">
                <span id="org">Your</span>
                <img src="./imgs/6.png" height="40px" alt="" />
                <span className="">Shop</span>
              </div>
            </span>
            <button
              className="toggle gray toggle_btn"
              onClick={toggleSidebarCollapseHandler}
            >
              <MenuOpenIcon />
            </button>
          </header>
          <div id="nav_links">
            <div id="link">
              <Link to="/dashboard">
                <span>
                  <DashboardOutlinedIcon />
                </span>
                <b className="sidebar_nav_txt">dashboard</b>
              </Link>
              <small className="sidebar_nav_txt">Functionality</small>
              {/* <Link to="/par-info">
                <span>
                  <AddBusinessIcon />
                </span>
                <b className="sidebar_nav_txt">PAR Info</b>
              </Link> */}
              <Link to="/product-acceptance">
                <span>
                  <AddBusinessIcon />
                </span>
                <b className="sidebar_nav_txt">Product Acceptance</b>
              </Link>

              <Link to="/dispatch-req">
                <span>
                  <LocalShippingIcon />
                </span>
                <b className="sidebar_nav_txt">Dispatching Items</b>
              </Link>

              <Link to="/customers">
                <span>
                  <LanguageOutlinedIcon />
                </span>
                <b className="sidebar_nav_txt">Plan Wise Aceptance Request</b>
              </Link>
              
              <small className="sidebar_nav_txt">Others</small>
              <Link to="/assisted-purchase">
                <span>
                  <ShoppingBagIcon />
                </span>
                <b className="sidebar_nav_txt">Assisted Purchase</b>
              </Link>
              {/* <Link to="/print-dis-doc">
                <span>
                  <InsertDriveFileOutlinedIcon />
                </span>
                <b className="sidebar_nav_txt">Print Dispatch Details</b>
              </Link> */}
              <a onClick={logout}>
                <span>
                  <LogoutOutlinedIcon />
                </span>
                <b className="sidebar_nav_txt">logout</b>
              </a>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
