import React, { useState, useEffect } from "react";
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
import { Spin } from "antd";
import SubNavbarDash from "../Components/SubNavbarDash";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ChartTitle,
  Tooltip,
  Legend
);

export default function Dash() {
  const [orderTypeData, setOrderTypeData] = useState({
    "Dine-In": 0,
    "Home Delivery": 0,
    "Take Away": 0,
  });
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(null);

  // Fetch data from Firestore and process it
  const getOrderTypeData = async () => {
    try {
      setLoading(true);

      // Fetch data from Firestore
      const data = await getDocs(collection(db, "Orders"));
      console.log("Fetched Firestore data:", data);

      const orders = data.docs.map((doc) => doc.data());
      console.log("Processed orders:", orders);

      // Initialize counts
      const orderTypeCounts = {
        "Dine-In": 0,
        "Home Delivery": 0,
        "Take Away": 0,
      };

      // Process each order and check for valid date/orderType fields
      orders.forEach((order) => {
        if (order.date && order.orderType) {
          // Ensure date and orderType exist
          const orderDate = moment(order.date.toDate()); // Assuming `order.date` is a Firebase Timestamp
          console.log("Order date converted to moment:", orderDate);

          const isSameDay =
            selectedDate && orderDate.isSame(selectedDate, "day");
          const isSameMonth =
            selectedDate && orderDate.isSame(selectedDate, "month");

          // Count the order if no filter, or if matches the selected date/month
          if (!selectedDate || isSameDay || isSameMonth) {
            if (orderTypeCounts[order.orderType] !== undefined) {
              orderTypeCounts[order.orderType]++;
            } else {
              console.warn(`Unexpected orderType: ${order.orderType}`);
            }
          }
        } else {
          console.warn("Order missing date or orderType:", order);
        }
      });

      console.log("Final order type counts:", orderTypeCounts);

      // Update state with new data
      setOrderTypeData(orderTypeCounts);
    } catch (error) {
      console.error("Error fetching order types:", error);
    } finally {
      setLoading(false);
    }
  };

  // Trigger data fetching whenever the selectedDate changes
  useEffect(() => {
    if (selectedDate) {
      getOrderTypeData();
    }
  }, [selectedDate]);

  // Handle date change from SubNavbarDash component
  // const handleDateChange = (date, dateString) => {
  //   if (dateString) {
  //     setSelectedDate(moment(dateString));
  //   } else {
  //     setSelectedDate(null); // Reset selectedDate when no date is selected
  //   }
  // };

  // Chart data (with fallback values)
  const data = {
    labels: ["Dine-In", "Home Delivery", "Take Away"],
    datasets: [
      {
        label: "Orders",
        data: [
          orderTypeData["Dine-In"] || 0,
          orderTypeData["Home Delivery"] || 0,
          orderTypeData["Take Away"] || 0,
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

  // Chart options
  const options = {
    responsive: true,
    plugins: {
      legend: { position: "top", labels: { font: { size: 14 } } },
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

  return (
    <div className="container">
      <SubNavbarDash title="Dashboard" onDateChange={handleDateChange} />

      {loading ? (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            paddingTop: "100px",
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
