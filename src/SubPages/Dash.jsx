import React, { useState, useEffect } from "react";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";
import { db } from "../Config/Firebase"; 
import { collection, getDocs } from "firebase/firestore";
import { DatePicker, Spin } from "antd";
import dayjs from "dayjs";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

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
      <h1 style={{ fontFamily: "Times New Roman", fontWeight: "bold", color: "#333", textAlign: "center" }}>
        Dashboard
      </h1>

      <div style={{ textAlign: "center", marginBottom: "20px" }}>
        <DatePicker
          picker="month"
          onChange={(date) => setSelectedDate(date)}
          placeholder="Select Month or Day"
        />
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
