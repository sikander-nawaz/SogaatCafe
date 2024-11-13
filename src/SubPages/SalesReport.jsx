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
    // Trigger print with filtered data for the selected month
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
      </head>
      <body>
        <h2>Sales Report for ${
          selectedMonth ? dayjs(selectedMonth).format("MMMM YYYY") : "All Time"
        }</h2>
        <table border="1" cellpadding="10" cellspacing="0">
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
        title="Sales Report"
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
