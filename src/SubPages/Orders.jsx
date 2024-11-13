import React, { useEffect, useState } from "react";
import { db } from "../Config/Firebase";
import { collection, deleteDoc, doc, getDocs } from "firebase/firestore";
import { Table, Button, Modal, Typography, message } from "antd";
import { EyeOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentOrder, setCurrentOrder] = useState(null);

  const { Text, Title } = Typography;

  // Fetch orders from the database, sorted by date
  const fetchOrders = async () => {
    const ordersCollectionRef = collection(db, "Orders");
    const data = await getDocs(ordersCollectionRef);
    const fetchedOrders = data.docs.map((doc) => ({ ...doc.data(), id: doc.id }));

    // Calculate the date 6 months ago from today
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    // Filter orders that are within the last 6 months
    const filteredOrders = fetchedOrders.filter(
      (order) => new Date(order.date) >= sixMonthsAgo
    );

    // Sort filtered orders by date in descending order (most recent first)
    const sortedOrders = filteredOrders.sort(
      (a, b) => new Date(b.date) - new Date(a.date)
    );

    setOrders(sortedOrders);
  };


  // Delete an order
  const deleteOrder = async (id) => {
    setIsDeleting(true);
    await deleteDoc(doc(db, "Orders", id));
    message.success("Order deleted successfully!");
    fetchOrders();
    setIsDeleting(false);
  };

  // View order details in modal
  const viewOrder = (order) => {
    setCurrentOrder(order);
    setIsModalVisible(true);
  };

  // Close the modal
  const handleModalClose = () => {
    setIsModalVisible(false);
    setCurrentOrder(null);
  };

  // Print the modal content
  const handlePrint = () => {
    window.print();
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const columns = [
    { title: "Order No.", dataIndex: "orderNumber", key: "orderNumber" },
    { title: "Date", dataIndex: "date", key: "date" },
    { title: "Order Type", dataIndex: "orderType", key: "orderType" },
    {
      title: "Total Price",
      dataIndex: "totalPrice",
      key: "totalPrice",
      render: (price) => `${price} RS`,
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <>
          <Button icon={<EyeOutlined />} onClick={() => viewOrder(record)} style={{ marginRight: "8px" }} />
          <Button icon={<EditOutlined />} style={{ marginRight: "8px" }} onClick={() => console.log("Edit functionality here")} />
          <Button icon={<DeleteOutlined />} danger loading={isDeleting} onClick={() => deleteOrder(record.id)} />
        </>
      ),
    },
  ];

  return (
    <div style={{ padding: "20px" }}>
      <Table dataSource={orders} columns={columns} rowKey="id" bordered pagination={{ pageSize: 5 }} style={{ backgroundColor: "#ffffff" }} />

      <Modal
        title="Order Details"
        visible={isModalVisible}
        onCancel={handleModalClose}
        footer={[
          <Button key="print" type="primary" onClick={handlePrint}>
            Print
          </Button>,
          <Button key="close" onClick={handleModalClose}>
            Close
          </Button>,
        ]}
      >
        {currentOrder && (
          <div>
            <Title level={4} style={{ textAlign: "center" }}>Bill</Title>
            <Text><strong>Date:</strong> {currentOrder.date}</Text>

            <Table
              dataSource={currentOrder.products}
              pagination={false}
              rowKey={(record) => record.name}
              style={{ marginTop: "10px", marginBottom: "10px" }}
              columns={[
                { title: "QTY", dataIndex: "quantity", key: "quantity", width: 80 },
                { title: "Order", dataIndex: "name", key: "name", render: (name) => <Text>{name}</Text> },
                { title: "Amount", dataIndex: "amount", key: "amount", render: (amount) => `${amount} RS`, width: 100 },
              ]}
            />

            <div style={{ textAlign: "right", marginTop: "10px" }}>
              <Text strong>Total Amount:</Text> <Text>{currentOrder.totalPrice} RS</Text>
            </div>

            <div style={{ textAlign: "center", marginTop: "20px" }}>
              <Text strong>Order No.:</Text> <Text>{currentOrder.orderNo}</Text>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Orders;
