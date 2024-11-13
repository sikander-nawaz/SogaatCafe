import React, { useState, useEffect } from "react";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";
import { db } from "../Config/Firebase"; // Adjust the path to your Firebase config
import { collection, getDocs } from "firebase/firestore";
import { PulseLoader } from "react-spinners";

// Register chart components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function Dashboard() {
  const [orderTypeData, setOrderTypeData] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch order data from Firestore
  const getOrderTypeData = async () => {
    try {
      const data = await getDocs(collection(db, "Orders"));
      const orders = data.docs.map((doc) => doc.data());

      const orderTypeCounts = {
        "Dine-In": 0,
        "Home Delivery": 0,
        "Take Away": 0,
      };

      orders.forEach((order) => {
        if (orderTypeCounts[order.orderType] !== undefined) {
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
  }, []);

  // Prepare data for the chart
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
          "rgba(75, 192, 192, 0.7)", // Dine-In
          "rgba(255, 159, 64, 0.7)",  // Home Delivery
          "rgba(153, 102, 255, 0.7)", // Take Away
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
        labels: {
          font: {
            size: 14,
          },
        },
      },
      title: {
        display: true,
        text: "Order Types Overview",
        font: {
          size: 18,
        },
      },
    },
    scales: {
      x: {
        ticks: {
          font: {
            size: 14,
          },
          color: "#555",
        },
      },
      y: {
        beginAtZero: true,
        ticks: {
          font: {
            size: 14,
          },
          color: "#555",
        },
      },
    },
  };

  return (
    <div className="container">
      <h1 style={{ fontFamily: "Times New Roman", fontWeight: "bold", color: "#333", textAlign: "center" }}>
        Dashboard
      </h1>

      {/* Loader */}
      {loading ? (
        <div className="d-flex justify-content-center align-items-center" style={{ height: "50vh" }}>
          <PulseLoader size={15} color={"#0077B6"} loading={loading} />
        </div>
      ) : (
        <div style={{ margin: "20px auto", backgroundColor: "#f9f9f9", borderRadius: "10px", boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)", padding: "20px", maxWidth: "800px" }}>
          <Bar data={data} options={options} />
        </div>
      )}
    </div>
  );
}
