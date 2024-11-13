import React, { useEffect, useState } from "react";
import { db } from "../Config/Firebase";
import { collection, getDocs } from "firebase/firestore";
import { Table, Typography } from "antd";

const SalesReport = () => {
  const [sales, setSales] = useState([]);
  const { Title } = Typography;

  // Fetch sales orders from the database within the last 6 months
  const fetchSales = async () => {
    const ordersCollectionRef = collection(db, "Orders");
    const data = await getDocs(ordersCollectionRef);
    const fetchedSales = data.docs.map((doc) => ({ ...doc.data(), id: doc.id }));

    // Calculate the date 6 months ago from today
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    // Filter orders to include only those within the last 6 months
    const filteredSales = fetchedSales.filter(
      (order) => new Date(order.date) >= sixMonthsAgo
    );

    // Sort filtered orders by date in descending order (most recent first)
    const sortedSales = filteredSales.sort(
      (a, b) => new Date(b.date) - new Date(a.date)
    );

    setSales(sortedSales);
  };

  useEffect(() => {
    fetchSales();
  }, []);

  const columns = [
    { title: "Order No.", dataIndex: "orderNumber", key: "orderNumber" },
    { title: "Date", dataIndex: "date", key: "date", render: (date) => new Date(date).toLocaleString() },
    { title: "Order Type", dataIndex: "orderType", key: "orderType" },
    {
      title: "Total Price",
      dataIndex: "totalPrice",
      key: "totalPrice",
      render: (price) => `${price} RS`,
    },
  ];

  return (
    <div style={{ padding: "20px" }}>
      <Title level={3}>Sales Report (Last 6 Months)</Title>
      <Table dataSource={sales} columns={columns} rowKey="id" bordered pagination={{ pageSize: 7 }} />
    </div>
  );
};

export default SalesReport;
