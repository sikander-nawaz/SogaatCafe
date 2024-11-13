import React, { useState } from "react";
import { Typography, DatePicker, Row, Col } from "antd";

const { Title } = Typography;
const { MonthPicker } = DatePicker;

const SubNavbarDash = ({ title, onDateChange }) => {
  const [isDatePickerDisabled, setIsDatePickerDisabled] = useState(false);
  const [isMonthPickerDisabled, setIsMonthPickerDisabled] = useState(false);

  // Handle date change and toggle MonthPicker
  const handleDateChange = (date, dateString) => {
    onDateChange(date, dateString);
    setIsMonthPickerDisabled(!!date);
    if (!date) setIsDatePickerDisabled(false);
  };

  // Handle month change and toggle DatePicker
  const handleMonthChange = (date, dateString) => {
    onDateChange(date, dateString);
    setIsDatePickerDisabled(!!date);
    if (!date) setIsMonthPickerDisabled(false);
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
          <Row gutter={16}>
            <Col>
              <DatePicker
                onChange={handleDateChange}
                placeholder="Select Date"
                format="YYYY-MM-DD"
                style={{ width: 200 }}
                disabled={isDatePickerDisabled}
              />
            </Col>
            <Col>
              <MonthPicker
                onChange={handleMonthChange}
                placeholder="Select Month"
                format="MMMM YYYY"
                style={{ width: 200 }}
                disabled={isMonthPickerDisabled}
              />
            </Col>
          </Row>
        </Col>
      </Row>
    </div>
  );
};

export default SubNavbarDash;
