import React, { useState } from 'react';
import { FaHome, FaList, FaBox, FaChartLine, FaUsers, FaBars } from 'react-icons/fa';
import './Sidebar.css';


const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  return (
    <div className={`app ${collapsed ? 'collapsed' : ''}`}>
      <div className="sidebar">
        <div className="sidebar-header">
          <h1 className="logo">{!collapsed && 'Sogaat Flavour'}</h1>
          <button className="toggle-btn" onClick={toggleSidebar}>
            <FaBars />
          </button>
        </div>
        <div className="menu">
          <div className="menu-item">
            <FaHome />
            {!collapsed && <span>Dashboard</span>}
          </div>
          <div className="menu-item">
            <FaList />
            {!collapsed && <span>Orders</span>}
          </div>
          <div className="menu-item">
            <FaBox />
            {!collapsed && <span>Take Orders</span>}
          </div>
          <div className="menu-item">
            <FaBox />
            {!collapsed && <span>Categories</span>}
          </div>
          <div className="menu-item">
            <FaBox />
            {!collapsed && <span>Products</span>}
          </div>
          <div className="menu-item">
            <FaChartLine />
            {!collapsed && <span>Sales Report</span>}
          </div>
          <div className="menu-item">
              <FaUsers />
              {!collapsed && <span>Users</span>}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="main-content">
        <div className="header">
          <h1>Welcome back, Yasir!</h1>
        </div>
      </main>
    </div>
  );
};

export default Sidebar;
