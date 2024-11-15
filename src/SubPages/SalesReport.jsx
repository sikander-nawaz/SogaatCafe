import React, { useEffect, useState } from "react";
import { db } from "../Config/Firebase";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { Table } from "antd";
import Navbar from "../Components/SubNavbar";
import dayjs from "dayjs";

const SalesReport = () => {
  const [sales, setSales] = useState([]);
  const [filteredSales, setFilteredSales] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(null);

  const fetchSales = async () => {
    const ordersCollectionRef = collection(db, "Orders");
    const data = await getDocs(ordersCollectionRef);
    const fetchedSales = data.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
    }));

    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - 185);

    const recentSales = fetchedSales.filter(
      (order) => new Date(order.date) >= cutoffDate
    );

    const outdatedSales = fetchedSales.filter(
      (order) => new Date(order.date) < cutoffDate
    );
    outdatedSales.forEach(async (order) => {
      const orderDoc = doc(db, "Orders", order.id);
      await deleteDoc(orderDoc);
    });

    const sortedSales = recentSales.sort(
      (a, b) => new Date(b.date) - new Date(a.date)
    );

    setSales(sortedSales);
    setFilteredSales(sortedSales);
  };

  const handleMonthChange = (date) => {
    if (date) {
      setSelectedMonth(date);
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
      setFilteredSales(sales);
    }
  };

  const handleExport = () => {
    const orderCount = filteredSales.length;

    // Calculate the count and percentage of each order type
    const orderTypeCounts = filteredSales.reduce(
      (acc, sale) => {
        acc[sale.orderType] = (acc[sale.orderType] || 0) + 1;
        return acc;
      },
      { "Dine-In": 0, "Home Delivery": 0, "Take Away": 0 }
    );

    const dineInCount = orderTypeCounts["Dine-In"];
    const homeDeliveryCount = orderTypeCounts["Home Delivery"];
    const takeAwayCount = orderTypeCounts["Take Away"];

    const dineInPercentage = ((dineInCount / orderCount) * 100).toFixed(2);
    const homeDeliveryPercentage = (
      (homeDeliveryCount / orderCount) *
      100
    ).toFixed(2);
    const takeAwayPercentage = ((takeAwayCount / orderCount) * 100).toFixed(2);

    const printContents = filteredSales
      .map(
        (sale) => `
      <tr>
        <td>${sale.orderNumber}</td>
        <td>${new Date(sale.date).toLocaleString()}</td>
        <td>${sale.orderType}</td>
        <td>${sale.totalPrice} RS</td>
      </tr>
    `
      )
      .join("");

    const printWindow = window.open("", "_blank");
    printWindow.document.write(`
      <html>
      <head>
        <title>Sales Report Export</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            text-align: center;
            margin: 0;
            padding: 20px;
          }
          .report-container {
            width: 80%;
            margin: auto;
            padding: 20px;
            border-radius: 8px;
          }
          h2 {
            margin-top: 0;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
          }
          th, td {
            border: 1px solid #ddd;
            padding: 8px;
          }
          th {
            background-color: #f2f2f2;
          }
          .summary {
            text-align: left;
            margin-bottom: 10px;
          }
          .summary p {
            margin: 5px 0;
          }
        </style>
      </head>
      <body>
        <div class="report-container">
          <h2>Sales Report for ${
            selectedMonth
              ? dayjs(selectedMonth).format("MMMM YYYY")
              : "All Time"
          }</h2>
          <div class="summary">
            <p><strong>Total Orders:</strong> Dine-In: ${dineInCount} || Home Delivery: ${homeDeliveryCount} || Take Away: ${takeAwayCount} || Total: ${orderCount}</p>
            <p><strong>Percentages:</strong> Dine-In: ${dineInPercentage}% || Home Delivery: ${homeDeliveryPercentage}% || Take Away: ${takeAwayPercentage}%</p>
          </div>
          <table>
            <thead>
              <tr>
                <th>Order No.</th>
                <th>Date</th>
                <th>Order Type</th>
                <th>Total Price</th>
              </tr>
            </thead>
            <tbody>
              ${printContents}
            </tbody>
          </table>
        </div>
      </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
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
      <Navbar
        title="Sales Reports"
        onMonthChange={handleMonthChange}
        onExport={handleExport}
      />
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
