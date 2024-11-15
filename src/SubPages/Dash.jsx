import React, { useState, useEffect } from "react";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title as ChartTitle, Tooltip, Legend } from "chart.js";
import { db } from "../Config/Firebase";
import { collection, getDocs } from "firebase/firestore";
import { DatePicker, Spin, Row, Col, Typography } from "antd"; // Import Typography here
import dayjs from "dayjs";

ChartJS.register(CategoryScale, LinearScale, BarElement, ChartTitle, Tooltip, Legend);

export default function Dashboard() {
  const [orderTypeData, setOrderTypeData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(null);

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
          (selectedDate.isSame(orderDate, 'day') || selectedDate.isSame(orderDate, 'month'))
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
  }, [selectedDate]);

  const data = {
    labels: ["Dine-In", "Home Delivery", "Take Away"],
    datasets: [
      {
        label: "Orders",
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

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
        labels: { font: { size: 14 } },
      },
      title: { display: true, text: "Order Types Overview", font: { size: 18 } },
    },
    scales: {
      x: { ticks: { font: { size: 14 }, color: "#555" } },
      y: { beginAtZero: true, ticks: { font: { size: 14 }, color: "#555" } },
    },
  };

  return (
    <div className="container">
      <div
        style={{
          padding: "10px 20px",
          backgroundColor: "#f0f2f5",
          borderBottom: "1px solid #d9d9d9",
        }}
      >
        <Row justify="space-between" align="middle">
          <Col>
            <Typography.Title level={3} style={{ margin: 0 }}> {/* Use Typography.Title here */}
              Dashboard
            </Typography.Title>
          </Col>
          <Col>
            <Row gutter={16}>
              <Col>
                <DatePicker
                  picker="month"
                  onChange={(date) => setSelectedDate(date)}
                  placeholder="Select Month or Day"
                />
              </Col>
            </Row>
          </Col>
        </Row>
      </div>

      {loading ? (
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", paddingTop: "120px" }}>
          <Spin size="large" />
        </div>
      ) : (
        <div style={{ margin: "20px auto", backgroundColor: "#f9f9f9", borderRadius: "10px", boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)", padding: "20px", maxWidth: "800px" }}>
          <Bar data={data} options={options} />
        </div>
      )}
    </div>
  );
}
