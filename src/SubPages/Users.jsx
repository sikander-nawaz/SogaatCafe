import React, { useEffect, useState } from "react";
import { db } from "../Config/Firebase";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import {
  DeleteOutlined,
  EditOutlined,
  EyeInvisibleOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import { Table, Button, Modal, Input, message, Row, Col } from "antd";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const collectionRef = collection(db, "Users");

  const fetchUsers = async () => {
    const data = await getDocs(collectionRef);
    const usersData = data.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
    setUsers(usersData);
    setFilteredUsers(usersData);
  };

  const addUser = async () => {
    if (newEmail && newPassword) {
      setIsAdding(true);
      const existingUsers = await getDocs(collectionRef);
      const usersData = existingUsers.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));

      const userExists = usersData.some((user) => user.email === newEmail);
      if (userExists) {
        message.error("User already exists!");
        setIsAdding(false);
        return;
      }

      await addDoc(collectionRef, { email: newEmail, password: newPassword });
      resetModal();
      message.success("User added successfully!");
      fetchUsers();
      setIsAdding(false);
    } else {
      message.error("Please fill in both fields!");
    }
  };

  const updateUser = async () => {
    if (newEmail && newPassword && currentUserId) {
      setIsUpdating(true);
      const userDoc = doc(db, "Users", currentUserId);
      await updateDoc(userDoc, { email: newEmail, password: newPassword });
      resetModal();
      message.success("User updated successfully!");
      fetchUsers();
      setIsUpdating(false);
    } else {
      message.error("Please fill in both fields!");
    }
  };

  const deleteUser = async (id) => {
    setIsDeleting(true);
    await deleteDoc(doc(db, "Users", id));
    message.success("User deleted successfully!");
    fetchUsers();
    setIsDeleting(false);
  };

  const handleEdit = (user) => {
    setNewEmail(user.email);
    setNewPassword(user.password);
    setCurrentUserId(user.id);
    setIsModalVisible(true);
  };

  const resetModal = () => {
    setNewEmail("");
    setNewPassword("");
    setIsModalVisible(false);
    setCurrentUserId(null);
    setShowPassword(false);
  };

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);

    const filtered = users.filter(
      (user) =>
        user.email.toLowerCase().includes(query) ||
        user.password.toLowerCase().includes(query)
    );
    setFilteredUsers(filtered);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const columns = [
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      sorter: (a, b) => a.email.localeCompare(b.email),
    },
    {
      title: "Password",
      dataIndex: "password",
      key: "password",
      render: (text) => <span style={{ fontWeight: "bold" }}>{text}</span>,
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <>
          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
            style={{ marginRight: "8px" }}
          />
          <Button
            type="primary"
            icon={<DeleteOutlined />}
            danger
            loading={isDeleting}
            onClick={() => deleteUser(record.id)}
          />
        </>
      ),
    },
  ];

  return (
    <>


<div      >
        <Row justify="space-between" align="middle">
          <Col>
            <h1
              style={{
                fontFamily: "Times New Roman",
                fontWeight: "bold",
                color: "#333",
                marginBottom: 0,
                paddingLeft : "20px"
              }}
            >
              Users
            </h1>
          </Col>
          <Col>
          <Input
          placeholder="Search by any field"
          value={searchQuery}
          onChange={handleSearch}
          style={{ marginBottom: "20px", width: "200px" }}
        />
          </Col>
        </Row>
      </div>

    
     
      <div style={{ padding: "20px" }}>
      
        <Table
          dataSource={filteredUsers}
          columns={columns}
          rowKey="id"
          bordered
          pagination={{ pageSize: 5 }}
          style={{ backgroundColor: "#ffffff" }}
        />

        <Modal
          title={currentUserId ? "Update User" : "Add New User"}
          visible={isModalVisible}
          onOk={currentUserId ? updateUser : addUser}
          onCancel={resetModal}
          okButtonProps={{
            loading: currentUserId ? isUpdating : isAdding,
          }}
          okText={currentUserId ? "Update" : "Add"}
          cancelText="Cancel"
        >
          <Input
            type="email"
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
            placeholder="Enter email"
            style={{ marginBottom: "10px" }}
          />
          <Input
            type={showPassword ? "text" : "password"}
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="Enter password"
            suffix={
              showPassword ? (
                <EyeOutlined
                  onClick={() => setShowPassword(false)}
                  style={{ cursor: "pointer" }}
                />
              ) : (
                <EyeInvisibleOutlined
                  onClick={() => setShowPassword(true)}
                  style={{ cursor: "pointer" }}
                />
              )
            }
          />
        </Modal>
        <Button
          type="primary"
          onClick={() => setIsModalVisible(true)}
          style={{ marginBottom: "20px" }}
        >
          Add User
        </Button>
      </div>
    </>
  );
};

export default Users;
