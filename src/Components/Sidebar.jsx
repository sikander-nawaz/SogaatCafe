import React, { useState, useEffect } from "react";
import {
  FaHome,
  FaChartLine,
  FaUsers,
  FaBars,
  FaClipboardList,
  FaHistory,
} from "react-icons/fa";
import { AiFillProduct } from "react-icons/ai";
import { MdCategory } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { SettingOutlined, UserOutlined } from "@ant-design/icons";
import { Dropdown, Space, Menu, Modal, Input, message, Avatar } from "antd";
import { db } from "../Config/Firebase";
import { collection, getDocs, doc, updateDoc } from "firebase/firestore";

import "./Sidebar.css";

import Users from "../SubPages/Users";
import Orders from "../SubPages/Orders";
import Category from "../SubPages/Category";
import Product from "../SubPages/Product";
import SalesReport from "../SubPages/SalesReport";
import Takeorder from "../SubPages/Takeorder";
import Dash from "../SubPages/Dash";

const Sidebar = () => {
  const [admindata, setAdmindata] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isUpdateModalVisible, setIsUpdateModalVisible] = useState(false);

  const [adminEmail, setAdminEmail] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [currentAdminId, setCurrentAdminId] = useState(null);

  const [collapsed, setCollapsed] = useState(false);
  const [selectedComponent, setSelectedComponent] = useState("Dashboard");

  const navigate = useNavigate();

  const collectionRef = collection(db, "Admin");

  const getdata = async () => {
    try {
      setLoading(true);
      const data = await getDocs(collectionRef);
      const filterData = data.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      if (filterData.length > 0) {
        setAdmindata(filterData);
        setAdminEmail(filterData[0].email);
        setAdminPassword(filterData[0].password);
        setCurrentAdminId(filterData[0].id);
      }
    } catch (error) {
      console.error("Error Fetching Data...", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getdata();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userPassword");
    navigate("/");
  };

  const handleUpdateProfile = async () => {
    if (!currentAdminId) return;

    try {
      const adminRef = doc(db, "Admin", currentAdminId);
      await updateDoc(adminRef, { email: adminEmail, password: adminPassword });
      setIsUpdateModalVisible(false);
      message.success("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile: ", error);
      message.error("Error updating profile");
    }
  };

  const menuItems = [
    { key: "1", label: "My Account", disabled: true },
    { type: "divider" },
    {
      key: "4",
      label: (
        <span onClick={() => setIsUpdateModalVisible(true)}>
          <SettingOutlined /> Update Profile
        </span>
      ),
    },
    { type: "divider" },
    {
      key: "6",
      label: (
        <span style={{ color: "red" }} onClick={handleLogout}>
          Logout
        </span>
      ),
    },
  ];

  const renderComponent = () => {
    switch (selectedComponent) {
      case "Users":
        return <Users />;
      case "Orders":
        return <Orders />;
      case "Category":
        return <Category />;
      case "Product":
        return <Product />;
      case "SalesReport":
        return <SalesReport />;
      case "Take Order":
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
          <button
            className="toggle-btn"
            onClick={() => setCollapsed(!collapsed)}
          >
            <FaBars />
          </button>
        </div>
        <div className="menu">
          {[
            { label: "Dashboard", icon: <FaHome /> },
            { label: "Orders", icon: <FaHistory /> },
            { label: "Take Order", icon: <FaClipboardList /> },
            { label: "Category", icon: <MdCategory /> },
            { label: "Product", icon: <AiFillProduct /> },
            { label: "SalesReport", icon: <FaChartLine /> },
            { label: "Users", icon: <FaUsers /> },
          ].map((item, index) => (
            <div
              key={index}
              className="menu-item"
              onClick={() => setSelectedComponent(item.label)}
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
          <Dropdown
            overlay={<Menu items={menuItems} />}
            trigger={["click"]}
            style={{
              backgroundColor: "#f0f2f5",
              borderBottom: "1px solid #d9d9d9",
            }}
          >
            <Avatar
              icon={<UserOutlined />}
              style={{
                backgroundColor: "#1677FF",
                cursor: "pointer",
              }}
            />
          </Dropdown>
        </div>
        {renderComponent()}
      </div>

      <Modal
        title="Update Profile"
        visible={isUpdateModalVisible}
        onCancel={() => setIsUpdateModalVisible(false)}
        onOk={handleUpdateProfile}
        okText="Update"
      >
        <Input
          placeholder="Email"
          value={adminEmail}
          onChange={(e) => setAdminEmail(e.target.value)}
        />
        <Input.Password
          placeholder="Password"
          value={adminPassword}
          onChange={(e) => setAdminPassword(e.target.value)}
        />
      </Modal>
    </div>
  );
};

export default Sidebar;
