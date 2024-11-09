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
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { Table, Button, Modal, Input, message } from "antd";

const Category = () => {
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentCategoryId, setCurrentCategoryId] = useState(null);
  const [isAdding, setIsAdding] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const collectionRef = collection(db, "Category");

  const fetchCategories = async () => {
    const data = await getDocs(collectionRef);
    setCategories(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
  };

  const addCategory = async () => {
    if (newCategory && newDescription) {
      setIsAdding(true);
      const existingCategories = await getDocs(collectionRef);
      const categoriesData = existingCategories.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));

      const categoryExists = categoriesData.some(
        (user) => user.category === newCategory
      );
      if (categoryExists) {
        message.error("Category already exists!");
        setIsAdding(false);
        return;
      }

      await addDoc(collectionRef, {
        category: newCategory,
        description: newDescription,
      });
      resetModal();
      message.success("Category added successfully!");
      fetchCategories();
      setIsAdding(false);
    } else {
      message.error("Please fill in both fields!");
    }
  };

  const updateCategory = async () => {
    if (newCategory && newDescription && currentCategoryId) {
      setIsUpdating(true);
      const categoryDoc = doc(db, "Category", currentCategoryId);
      await updateDoc(categoryDoc, {
        category: newCategory,
        description: newDescription,
      });
      resetModal();
      message.success("Category updated successfully!");
      fetchCategories();
      setIsUpdating(false);
    } else {
      message.error("Please fill in both fields!");
    }
  };

  const deleteCategory = async (id) => {
    setIsDeleting(true);
    await deleteDoc(doc(db, "Category", id));
    message.success("Category deleted successfully!");
    fetchCategories();
    setIsDeleting(false);
  };

  const handleEdit = (user) => {
    setNewCategory(user.category);
    setNewDescription(user.description);
    setCurrentCategoryId(user.id);
    setIsModalVisible(true);
  };

  const resetModal = () => {
    setNewCategory("");
    setNewDescription("");
    setIsModalVisible(false);
    setCurrentCategoryId(null);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const columns = [
    {
      title: "Category",
      dataIndex: "category",
      key: "category",
      sorter: (a, b) => a.category.localeCompare(b.category),
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
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
          dataSource={categories}
          columns={columns}
          rowKey="id"
          bordered
          pagination={{ pageSize: 5 }}
          style={{ backgroundColor: "#ffffff" }}
        />

        <Modal
          title={currentCategoryId ? "Update Category" : "Add New Category"}
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
            type="text"
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
            placeholder="Enter email"
            style={{ marginBottom: "10px" }}
          />
          <Input
            type="text"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="Enter password"
          />
        </Modal>
        <Button
          type="primary"
          onClick={() => setIsModalVisible(true)}
          style={{ marginBottom: "20px" }}
        >
          Add Category
        </Button>
      </div>
    </>
  );
};

export default Category;
