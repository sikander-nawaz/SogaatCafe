import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom"; // Import useLocation
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title as ChartTitle,
  Tooltip,
  Legend,
} from "chart.js";
import { db } from "../Config/Firebase";
import { collection, getDocs } from "firebase/firestore";
import { DatePicker, Spin, Row, Col, Typography, Select } from "antd";
import dayjs from "dayjs";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ChartTitle,
  Tooltip,
  Legend
);

const { Title } = Typography;

export default function Dashboard() {
  const [orderTypeData, setOrderTypeData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(null);
  const [datePickerMode, setDatePickerMode] = useState("date"); // Default to "day"

  const location = useLocation(); // Hook to get current route

  useEffect(() => {
    // Update the datePickerMode based on the route
    if (location.pathname === "/dashboard") {
      setDatePickerMode("month"); // Show "month" picker in Dashboard
    } else {
      setDatePickerMode("date"); // Show "date" picker in Home
    }
  }, [location.pathname]);

  const getOrderTypeData = async () => {
    try {
      const data = await getDocs(collection(db, "Orders"));
      const orders = data.docs.map((doc) => doc.data());

      const orderTypeCounts = {
        "Dine-In": 0,
        "Home Delivery": 0,
        "Take Away": 0,
      };

      // Filter orders based on selectedDate
      orders.forEach((order) => {
        const orderDate = dayjs(order.date);

        if (
          !selectedDate ||
          (datePickerMode === "date" &&
            selectedDate.isSame(orderDate, "day")) || // specific day match
          (datePickerMode === "month" &&
            selectedDate.isSame(orderDate, "month")) // specific month match
        ) {
          orderTypeCounts[order.orderType]++;
        }
      });

      setOrderTypeData(orderTypeCounts);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching order types", error);
    }
  };

  useEffect(() => {
    setLoading(true);
    getOrderTypeData();
  }, [selectedDate, datePickerMode]);

  // data-set for graph
  const data = {
    labels: ["Dine-In", "Home Delivery", "Take Away"],
    datasets: [
      {
        label: " ",
        data: [
          orderTypeData["Dine-In"],
          orderTypeData["Home Delivery"],
          orderTypeData["Take Away"],
        ],
        backgroundColor: [
          "rgba(75, 192, 192, 0.7)",
          "rgba(255, 159, 64, 0.7)",
          "rgba(153, 102, 255, 0.7)",
        ],
        borderColor: [
          "rgba(75, 192, 192, 1)",
          "rgba(255, 159, 64, 1)",
          "rgba(153, 102, 255, 1)",
        ],
        borderWidth: 2,
        borderRadius: 5,
        hoverBackgroundColor: [
          "rgba(75, 192, 192, 0.9)",
          "rgba(255, 159, 64, 0.9)",
          "rgba(153, 102, 255, 0.9)",
        ],
      },
    ],
  };

  // graph-scalling
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
        labels: { font: { size: 14 } },
      },
      title: {
        display: true,
        text: "Order Types Overview",
        font: { size: 18 },
      },
    },
    scales: {
      x: { ticks: { font: { size: 14 }, color: "#555" } },
      y: { beginAtZero: true, ticks: { font: { size: 14 }, color: "#555" } },
    },
  };

  //frontend started
  return (
    <div className="container">
      <div
        style={{
          marginTop: "-52px",
          padding: "10px",
          backgroundColor: "#f0f2f5",
          borderBottom: "1px solid #d9d9d9",
        }}
      >
        <Row justify="space-between" align="middle">
          <Col>
            <Title level={3} style={{ margin: 0 }}>
              Dashboard
            </Title>
          </Col>
          <Col>
            <Row
              gutter={16}
              style={{
                marginRight: "36px",
                zIndex: "3",
              }}
            >
              {location.pathname === "/dashboard" && (
                <Col>
                  <Select
                    defaultValue="month"
                    style={{ width: 120, zIndex: "3" }}
                    onChange={(value) => setDatePickerMode(value)}
                  >
                    <Select.Option value="month">Month</Select.Option>
                    <Select.Option value="date">Day</Select.Option>
                  </Select>
                </Col>
              )}
              <Col>
                <DatePicker
                  style={{ zIndex: "3" }}
                  picker={datePickerMode}
                  onChange={(date) => setSelectedDate(date)}
                  placeholder={`Select ${
                    datePickerMode === "month" ? "Month" : "Day"
                  }`}
                />
              </Col>
            </Row>
          </Col>
        </Row>
      </div>

      {loading ? (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            paddingTop: "120px",
          }}
        >
          <Spin size="large" />
        </div>
      ) : (
        <div
          style={{
            margin: "20px auto",
            backgroundColor: "#f9f9f9",
            borderRadius: "10px",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
            padding: "20px",
            maxWidth: "800px",
          }}
        >
          <Bar data={data} options={options} />
        </div>
      )}
    </div>
  );
}
