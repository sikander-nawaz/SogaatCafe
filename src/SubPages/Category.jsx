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
  Table,
  Button,
  Modal,
  Input,
  message,
  Row,
  Col,
  Typography,
} from "antd";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";

const { Title } = Typography;

const Category = () => {
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentCategoryId, setCurrentCategoryId] = useState(null);
  const [isAdding, setIsAdding] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const collectionRef = collection(db, "Category");

  const fetchCategories = async () => {
    const data = await getDocs(collectionRef);
    setCategories(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
  };

  const addCategory = async () => {
    if (!newCategory || !newDescription) {
      message.error("Please fill out all fields.");
      return;
    }

    setIsAdding(true);
    try {
      await addDoc(collectionRef, {
        category: newCategory,
        description: newDescription,
      });
      message.success("Category added successfully!");
      fetchCategories();
      resetModal();
    } catch (error) {
      message.error("Failed to add category.");
    } finally {
      setIsAdding(false);
    }
  };

  const updateCategory = async () => {
    if (!newCategory || !newDescription || !currentCategoryId) {
      message.error("Please fill out all fields.");
      return;
    }

    setIsUpdating(true);
    try {
      const categoryDoc = doc(db, "Category", currentCategoryId);
      await updateDoc(categoryDoc, {
        category: newCategory,
        description: newDescription,
      });
      message.success("Category updated successfully!");
      fetchCategories();
      resetModal();
    } catch (error) {
      message.error("Failed to update category.");
    } finally {
      setIsUpdating(false);
    }
  };

  const deleteCategory = async (id) => {
    setIsUpdating(true);
    try {
      const categoryDoc = doc(db, "Category", id);
      await deleteDoc(categoryDoc);
      message.success("Category deleted successfully!");
      fetchCategories();
    } catch (error) {
      message.error("Failed to delete category.");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleEdit = (category) => {
    setCurrentCategoryId(category.id);
    setNewCategory(category.category);
    setNewDescription(category.description);
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

  const filteredCategories = categories.filter((category) =>
    category.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const columns = [
    {
      title: "Category",
      dataIndex: "category",
      key: "category",
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <>
          <Button
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
            style={{ marginRight: "8px" }}
          />
          <Button
            danger
            icon={<DeleteOutlined />}
            onClick={() => deleteCategory(record.id)}
          />
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
            paddingRight: "71px",
          }}
        >
          <Col>
            <Title level={3} style={{ margin: 0 }}>
              Categories
            </Title>
          </Col>

          <Col>
            <Row gutter={16}>
              <Col>
                <Input
                  placeholder="Search Category"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{ width: "300px" }}
                />
              </Col>
              <Col>
                <Button type="primary" onClick={() => setIsModalVisible(true)}>
                  Add Category
                </Button>
              </Col>
            </Row>
          </Col>
        </Row>
      </div>

      <div style={{ padding: "20px" }}>
        <Table
          dataSource={filteredCategories}
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
      </div>
    </>
  );
};

export default Category;
