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
import { Table, Button, Modal, Input, message } from "antd";

const Category = () => {
  const [users, setUsers] = useState([]);
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
    setUsers(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
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
      <div style={{ padding: "20px" }}>
        <Table
          dataSource={users}
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

export default Category;
