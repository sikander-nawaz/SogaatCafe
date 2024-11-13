// Navbar.js
import React from "react";
import { Typography, DatePicker, Row, Col } from "antd";
import dayjs from "dayjs";

const { Title } = Typography;
const { MonthPicker } = DatePicker;

const SubNavbar = ({ title, onMonthChange }) => {
  // Trigger the onMonthChange event when the user selects a month
  const handleMonthSelect = (date) => {
    if (date) {
      onMonthChange(date);
    }
  };

  return (
    <div
      style={{
        padding: "10px 20px",
        backgroundColor: "#f0f2f5",
        borderBottom: "1px solid #d9d9d9",
      }}
    >
      <Row justify="space-between" align="middle">
        <Col>
          <Title level={3} style={{ margin: 0 }}>
            {title}
          </Title>
        </Col>
        <Col>
          <MonthPicker
            onChange={handleMonthSelect}
            placeholder="Select Month"
            format="MMMM YYYY"
            style={{ width: 200 }}
          />
        </Col>
      </Row>
    </div>
  );
};

export default SubNavbar;
