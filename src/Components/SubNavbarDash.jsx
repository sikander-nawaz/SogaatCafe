// SubNavbarDash.jsx
import React from "react";
import { DatePicker } from "antd";
import "antd/dist/antd.css"; // Import Ant Design styles
import moment from "moment";

export default function SubNavbarDash({ onDateChange }) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "10px 20px",
        borderBottom: "1px solid #ddd",
        marginBottom: "20px",
      }}
    >
      <h2
        style={{
          fontFamily: "Times New Roman",
          fontWeight: "bold",
          color: "#333",
        }}
      >
        Dashboard
      </h2>

      <DatePicker
        onChange={onDateChange}
        picker="date"
        format="YYYY-MM-DD"
        style={{ marginRight: "10px" }}
      />

      <DatePicker onChange={onDateChange} picker="month" format="YYYY-MM" />
    </div>
  );
}
