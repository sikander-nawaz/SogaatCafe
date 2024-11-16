// Navbar.js
import React from "react";
import { Typography, DatePicker, Row, Col, Button } from "antd";

const { Title } = Typography;
const { MonthPicker } = DatePicker;

const SubNavbar = ({ title, onMonthChange, onExport }) => {
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
        // marginTop: "-52px",
        width: "100%",
        // position: "relative", // or 'absolute' if needed
        // zIndex: 1, // Lower z-index to move it behind
      }}
    >
      <Row justify="space-between" align="middle">
        <Col>
          <Title level={3} style={{ margin: 0 }}>
            {title}
          </Title>
        </Col>
        <Col style={{ paddingRight: "50px" }}>
          <Row gutter={16}>
            <Col>
              <MonthPicker
                onChange={handleMonthSelect}
                placeholder="Select Month"
                format="MMMM YYYY"
                style={{ width: 200 }}
              />
            </Col>
            <Col>
              <Button type="primary" onClick={onExport}>
                Export
              </Button>
            </Col>
          </Row>
        </Col>
      </Row>
    </div>
  );
};

export default SubNavbar;
