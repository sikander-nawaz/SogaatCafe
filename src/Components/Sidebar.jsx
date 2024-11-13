import React, { useState } from 'react';
import { FaHome, FaList, FaBox, FaChartLine, FaUsers, FaBars } from 'react-icons/fa';
import './Sidebar.css';
import Users from '../SubPages/Users';
import Orders from '../SubPages/Orders';
import Category from "../SubPages/Category";
import Product from "../SubPages/Product";
import SalesReport from "../SubPages/SalesReport";
import Takeorder from "../SubPages/Takeorder";
import Dash from '../SubPages/Dash';


const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [selectedComponent, setSelectedComponent] = useState('Dashboard');

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  const renderComponent = () => {
    switch (selectedComponent) {
      case 'Users':
        return <Users />;
      case 'Orders':
        return <Orders />;
      case 'Category':
        return <Category />;
      case 'Product':
        return <Product />;
      case 'SalesReport':
        return <SalesReport />;
      case 'TakeOrder':
        return <Takeorder />;
      default:
        return <Dash/>;
    }
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
          <div className="menu-item" onClick={() => setSelectedComponent('Dashboard')}>
            <FaHome />
            {!collapsed && <span>Dashboard</span>}
          </div>
          <div className="menu-item" onClick={() => setSelectedComponent('Orders')}>
            <FaList />
            {!collapsed && <span>Orders</span>}
          </div>
          <div className="menu-item" onClick={() => setSelectedComponent('TakeOrder')}>
            <FaBox />
            {!collapsed && <span>Take Orders</span>}
          </div>
          <div className="menu-item" onClick={() => setSelectedComponent('Category')}>
            <FaBox />
            {!collapsed && <span>Categories</span>}
          </div>
          <div className="menu-item" onClick={() => setSelectedComponent('Product')}>
            <FaBox />
            {!collapsed && <span>Products</span>}
          </div>
          <div className="menu-item" onClick={() => setSelectedComponent('SalesReport')}>
            <FaChartLine />
            {!collapsed && <span>Sales Report</span>}
          </div>
          <div className="menu-item" onClick={() => setSelectedComponent('Users')}>
            <FaUsers />
            {!collapsed && <span>Users</span>}
          </div>
        </div>
      </div>

      {/* Main Cont */}
      <main className="main-content">
        <div className="header">
          {renderComponent()}
        </div>
      </main>
    </div>
  );
};

export default Sidebar;
