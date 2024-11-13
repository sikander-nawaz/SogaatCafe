import React, { useEffect, useState } from "react";
import { db } from "../Config/Firebase";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { Table } from "antd";
import Navbar from "../Components/SubNavbar";
import dayjs from "dayjs";

const SalesReport = () => {
  const [sales, setSales] = useState([]);
  const [filteredSales, setFilteredSales] = useState([]);

  // Fetch sales orders from the database within the last 185 days and delete older ones
  const fetchSales = async () => {
    const ordersCollectionRef = collection(db, "Orders");
    const data = await getDocs(ordersCollectionRef);
    const fetchedSales = data.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
    }));

    // Calculate the date 185 days ago from today
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - 185);

    // Filter orders to include only those within the last 185 days
    const recentSales = fetchedSales.filter(
      (order) => new Date(order.date) >= cutoffDate
    );

    // Delete outdated records from Firebase
    const outdatedSales = fetchedSales.filter(
      (order) => new Date(order.date) < cutoffDate
    );
    outdatedSales.forEach(async (order) => {
      const orderDoc = doc(db, "Orders", order.id);
      await deleteDoc(orderDoc);
    });

    // Sort filtered orders by date in descending order (most recent first)
    const sortedSales = recentSales.sort(
      (a, b) => new Date(b.date) - new Date(a.date)
    );

    setSales(sortedSales);
    setFilteredSales(sortedSales); // Initially display all recent sales
  };

  // Filter sales based on the selected month
  const handleMonthChange = (date) => {
    if (date) {
      const selectedMonth = dayjs(date).month();
      const selectedYear = dayjs(date).year();

      const monthFilteredSales = sales.filter((sale) => {
        const saleDate = new Date(sale.date);
        return (
          saleDate.getMonth() === selectedMonth &&
          saleDate.getFullYear() === selectedYear
        );
      });

      setFilteredSales(monthFilteredSales);
    } else {
      // Reset to show all sales if no month is selected
      setFilteredSales(sales);
    }
  };

  useEffect(() => {
    fetchSales();
  }, []);

  const columns = [
    { title: "Order No.", dataIndex: "orderNumber", key: "orderNumber" },
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
      render: (date) => new Date(date).toLocaleString(),
    },
    { title: "Order Type", dataIndex: "orderType", key: "orderType" },
    {
      title: "Total Price",
      dataIndex: "totalPrice",
      key: "totalPrice",
      render: (price) => `${price} RS`,
    },
  ];

  return (
    <>
      <Navbar title="Sales Report" onMonthChange={handleMonthChange} />
      <div style={{ padding: "20px" }}>
        <Table
          dataSource={filteredSales}
          columns={columns}
          rowKey="id"
          bordered
          pagination={{ pageSize: 7 }}
        />
      </div>
    </>
  );
};

export default SalesReport;
