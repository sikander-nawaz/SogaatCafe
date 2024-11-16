import React, { useState } from "react";
import { FaHome, FaList, FaBox, FaBars } from "react-icons/fa";
import { DownOutlined, UserOutlined } from "@ant-design/icons";
import { Dropdown, Space, Menu, Avatar } from "antd";
import { useNavigate } from "react-router-dom";

import "./UserSlider.css";

import Orders from "../SubPages/Orders";
import Takeorder from "../SubPages/Takeorder";
import Dash from "../SubPages/Dash";

const UserSidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [selectedComponent, setSelectedComponent] = useState("Dashboard");

  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated");
    navigate("/");
  };

  const items = [
    { key: "1", label: "My Account", disabled: true },
    { type: "divider" },
    {
      key: "6",
      label: "Logout",
      onClick: handleLogout,
      style: { color: "red" },
    },
  ];

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  const renderComponent = () => {
    switch (selectedComponent) {
      case "Orders":
        return <Orders />;
      case "TakeOrder":
        return <Takeorder />;
      default:
        return <Dash />;
    }
  };

  return (
    <div className={`app ${collapsed ? "collapsed" : ""}`}>
      <div className="sidebar">
        <div className="sidebar-header">
          <h1 className="logo">{!collapsed && "Sogaat Flavour"}</h1>
          <button className="toggle-btn" onClick={toggleSidebar}>
            <FaBars />
          </button>
        </div>
        <div className="menu">
          {[
            { label: "Dashboard", icon: <FaHome />, key: "Dashboard" },
            { label: "Orders", icon: <FaList />, key: "Orders" },
            { label: "TakeOrder", icon: <FaBox />, key: "TakeOrder" },
          ].map((item, index) => (
            <div
              key={index}
              className={`menu-item ${
                selectedComponent === item.key ? "active" : ""
              }`}
              onClick={() => setSelectedComponent(item.key)}
            >
              {item.icon}
              {!collapsed && <span>{item.label}</span>}
            </div>
          ))}
        </div>
      </div>

      <div className="main-content">
        <div
          className="header d-flex justify-content-end"
          style={{ position: "absolute", zIndex: "2", marginLeft: "980px" }}
        >
          <Dropdown overlay={<Menu items={items} />} trigger={["click"]}>
            <Avatar
              icon={<UserOutlined />}
              style={{ backgroundColor: "#1677FF", cursor: "pointer" }}
            />
          </Dropdown>
        </div>
        {renderComponent()}
      </div>
    </div>
  );
};

export default UserSidebar;
