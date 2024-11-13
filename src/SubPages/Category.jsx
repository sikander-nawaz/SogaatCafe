import React, { useEffect, useState } from "react";
import { db } from "../Config/Firebase";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  where,
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
        (cat) => cat.category === newCategory
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

    // Delete category
    await deleteDoc(doc(db, "Category", id));

    // Delete associated products
    const productCollectionRef = collection(db, "Product");
    const productsQuery = query(
      productCollectionRef,
      where("category", "==", categories.find((cat) => cat.id === id)?.category)
    );
    const productDocs = await getDocs(productsQuery);
    productDocs.forEach(async (productDoc) => {
      await deleteDoc(productDoc.ref);
    });

    message.success("Category and its products deleted successfully!");
    fetchCategories();
    setIsDeleting(false);
  };

  const handleEdit = (category) => {
    setNewCategory(category.category);
    setNewDescription(category.description);
    setCurrentCategoryId(category.id);
    setIsModalVisible(true);
  };

  const resetModal = () => {
    setNewCategory("");
    setNewDescription("");
    setIsModalVisible(false);
    setCurrentCategoryId(null);
  };

  useEffect(() => {
    fetchCategories();
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
            onClick={() => deleteCategory(record.id)}
          />
        </>
      ),
    },
  ];

  return (
    <>
      <h1 style={{ fontFamily: "Times New Roman", fontWeight: "bold", color: "#333", textAlign: "center" }}>
        Category
      </h1>
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
          onOk={currentCategoryId ? updateCategory : addCategory}
          onCancel={resetModal}
          okButtonProps={{
            loading: currentCategoryId ? isUpdating : isAdding,
          }}
          okText={currentCategoryId ? "Update" : "Add"}
          cancelText="Cancel"
        >
          <Input
            type="text"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            placeholder="Enter category"
            style={{ marginBottom: "10px" }}
          />
          <Input
            type="text"
            value={newDescription}
            onChange={(e) => setNewDescription(e.target.value)}
            placeholder="Enter description"
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
