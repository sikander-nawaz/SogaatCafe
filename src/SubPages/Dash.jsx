import React, { useEffect, useState } from "react";
import { db } from "../Config/Firebase";
import { getDocs, collection } from "firebase/firestore";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, CartesianGrid } from "recharts";

const Dash = () => {
  const [orderData, setOrderData] = useState([]);

  const fetchOrderData = async () => {
    const ordersCollectionRef = collection(db, "Orders");
    const data = await getDocs(ordersCollectionRef);

    const orders = data.docs.map((doc) => doc.data());

    const orderTypeCount = {
      "Dine-In": 0,
      "Home Delivery": 0,
      "Take Away": 0,
    };

    orders.forEach((order) => {
      if (orderTypeCount[order.orderType] !== undefined) {
        orderTypeCount[order.orderType]++;
      }
    });

    const formattedData = Object.keys(orderTypeCount).map((type) => ({
      orderType: type,
      count: orderTypeCount[type],
    }));

    setOrderData(formattedData);
  };

  useEffect(() => {
    fetchOrderData();
  }, []);

  return (
    <div style={{ width: "100%", height: 400, textAlign: "center", padding: "20px", backgroundColor: "#f8f9fa", borderRadius: "10px", boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)" }}>
      <h2 style={{ color: "#333", fontFamily: "Arial, sans-serif", fontWeight: "600", marginBottom: "20px" }}>Order Types Summary</h2>
      <ResponsiveContainer>
        <BarChart data={orderData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="orderType" tick={{ fontSize: 14, fontWeight: "500", fill: "#555" }} />
          <YAxis tick={{ fontSize: 14, fontWeight: "500", fill: "#555" }} />
          <Tooltip contentStyle={{ backgroundColor: "#333", color: "#fff", borderRadius: "8px" }} />
          <Legend verticalAlign="top" wrapperStyle={{ top: -10 }} />
          <Bar dataKey="count" fill="url(#colorGradient)" barSize={50} radius={[10, 10, 0, 0]} />
          <defs>
            <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#42a5f5" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#1e88e5" stopOpacity={0.6} />
            </linearGradient>
          </defs>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default Dash;
