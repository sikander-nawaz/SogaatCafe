import React, { useEffect, useState } from "react";
import { db } from "../Config/Firebase";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import {
  Table,
  Button,
  Modal,
  Typography,
  message,
  Input,
  Row,
  Col,
  Form,
} from "antd";
import {
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { useLocation } from "react-router-dom"; // Import useLocation
import Image from "../Assets/Images/logo.png";

const { Title } = Typography;

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [currentOrder, setCurrentOrder] = useState(null);
  const [editingOrder, setEditingOrder] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const { Text, Title } = Typography;
  const location = useLocation(); // Use useLocation to get the current route

  // Fetch orders from the database
  const fetchOrders = async () => {
    const ordersCollectionRef = collection(db, "Orders");
    const data = await getDocs(ordersCollectionRef);
    const fetchedOrders = data.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
    }));

    // Filter orders within the last 36 hours
    const thirtySixHoursAgo = new Date(Date.now() - 36 * 60 * 60 * 1000);
    const filteredOrders = fetchedOrders.filter(
      (order) => new Date(order.date) >= thirtySixHoursAgo
    );

    // Sort orders by date in descending order
    const sortedOrders = filteredOrders.sort(
      (a, b) => new Date(b.date) - new Date(a.date)
    );

    setOrders(sortedOrders);
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const deleteOrder = async (id) => {
    setIsDeleting(true);
    await deleteDoc(doc(db, "Orders", id));
    message.success("Order deleted successfully!");
    fetchOrders();
    setIsDeleting(false);
  };

  // Print the modal content
  const handlePrint = () => {
    window.print();
  };

  const viewOrder = (order) => {
    setCurrentOrder(order);
    setIsModalVisible(true);
  };

  const editOrder = (order) => {
    setEditingOrder({ ...order }); // Create a copy of the order to edit
    setIsEditModalVisible(true);
  };

  const handleEditModalClose = () => {
    setIsEditModalVisible(false);
    setEditingOrder(null);
  };

  const handleEditSave = async () => {
    if (!editingOrder) return;

    try {
      await updateDoc(doc(db, "Orders", editingOrder.id), editingOrder);
      message.success("Order updated successfully!");
      fetchOrders();
      handleEditModalClose();
    } catch (error) {
      message.error("Failed to update the order. Please try again.");
    }
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value.toLowerCase());
  };

  const filteredOrders = orders.filter(
    (order) =>
      order.orderNumber.toLowerCase().includes(searchQuery) ||
      order.orderType.toLowerCase().includes(searchQuery) ||
      (order.totalPrice && order.totalPrice.toString().includes(searchQuery))
  );

  const columns = [
    { title: "Order No.", dataIndex: "orderNumber", key: "orderNumber" },
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
      render: (date) =>
        new Date(date).toLocaleString("en-GB", {
          year: "numeric",
          month: "short",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        }),
    },
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
          <Button
            icon={<EyeOutlined />}
            onClick={() => viewOrder(record)}
            style={{ marginRight: "8px" }}
          />
          <Button
            icon={<EditOutlined />}
            onClick={() => editOrder(record)}
            style={{ marginRight: "8px" }}
          />
          {location.pathname === "/dashboard" && ( // Show Delete button only on Dashboard route
            <Button
              icon={<DeleteOutlined />}
              danger
              loading={isDeleting}
              onClick={() => deleteOrder(record.id)}
            />
          )}
        </>
      ),
    },
  ];

  return (
    <>
      <div
        style={{
          padding: "10px 20px",
          backgroundColor: "#f0f2f5",
          borderBottom: "1px solid #d9d9d9",
        }}
      >
        <Row
          justify="space-between"
          align="middle"
          style={{
            paddingRight: "69px",
          }}
        >
          <Col>
            <Title level={3} style={{ margin: 0 }}>
              Orders
            </Title>
          </Col>
          <Col>
            <Input
              prefix={<SearchOutlined />}
              placeholder="Search by Order No., Type, or Total Price"
              value={searchQuery}
              onChange={handleSearch}
              style={{ width: "300px" }}
            />
          </Col>
        </Row>
      </div>

      <div style={{ padding: "20px" }}>
        <Table
          dataSource={filteredOrders}
          columns={columns}
          rowKey="id"
          bordered
          pagination={{ pageSize: 5 }}
          style={{ backgroundColor: "#ffffff" }}
        />

        {/* Order Details Modal */}
        <Modal
          title="Order Details"
          visible={isModalVisible}
          onCancel={() => setIsModalVisible(false)}
          footer={[
            <Button key="print" type="primary" onClick={handlePrint}>
              Print
            </Button>,
            <Button key="close" onClick={() => setIsModalVisible(false)}>
              Close
            </Button>,
          ]}
        >
          {currentOrder && (
            <div>
              <Title level={4} style={{ textAlign: "center" }}>
                Bill
              </Title>
              <Text>
                <strong>Date:</strong> {currentOrder.date}
              </Text>
              <img
                src={Image}
                alt=""
                width={120}
                height={130}
                className="d-block mx-auto"
                style={{ objectFit: "cover", borderRadius: "10px" }}
              />
              <Table
                dataSource={currentOrder.items}
                pagination={false}
                rowKey={(record) => record.id}
                style={{ marginTop: "10px", marginBottom: "10px" }}
                columns={[
                  {
                    title: "QTY",
                    dataIndex: "quantity",
                    key: "quantity",
                    width: 80,
                  },
                  {
                    title: "Order",
                    dataIndex: "product",
                    key: "product",
                    render: (product) => <Text>{product}</Text>,
                  },
                  {
                    title: "Amount",
                    dataIndex: "price",
                    key: "price",
                    render: (price) => `${price} RS`,
                    width: 100,
                  },
                ]}
              />

              <div style={{ textAlign: "right", marginTop: "10px" }}>
                <Text strong>Total Amount:</Text>{" "}
                <Text>{currentOrder.totalPrice} RS</Text>
              </div>

              <div style={{ textAlign: "center", marginTop: "20px" }}>
                <Text strong>Order No.:</Text>{" "}
                <Text>{currentOrder.orderNumber}</Text>
              </div>
            </div>
          )}
        </Modal>

        {/* Edit Order Modal */}
        <Modal
          title="Edit Order"
          visible={isEditModalVisible}
          onCancel={handleEditModalClose}
          onOk={handleEditSave}
          okText="Save"
        >
          {editingOrder && (
            <Form layout="vertical">
              <Form.Item label="Order Type">
                <Input
                  value={editingOrder.orderType}
                  onChange={(e) =>
                    setEditingOrder({
                      ...editingOrder,
                      orderType: e.target.value,
                    })
                  }
                />
              </Form.Item>
              <Form.Item label="Total Price">
                <Input
                  value={editingOrder.totalPrice}
                  onChange={(e) =>
                    setEditingOrder({
                      ...editingOrder,
                      totalPrice: parseFloat(e.target.value),
                    })
                  }
                />
              </Form.Item>
            </Form>
          )}
        </Modal>
      </div>
    </>
  );
};

export default Orders;
