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
import {
  Table,
  Button,
  Modal,
  Input,
  Select,
  message,
  Row,
  Col,
  Typography,
} from "antd";

const { Title } = Typography;

const Product = () => {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [newProduct, setNewProduct] = useState("");
  const [newPrice, setNewPrice] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentProductId, setCurrentProductId] = useState(null);
  const [isAdding, setIsAdding] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const categoryCollectionRef = collection(db, "Category");
  const productCollectionRef = collection(db, "Product");

  // Fetch categories from Firebase
  const fetchCategories = async () => {
    const data = await getDocs(categoryCollectionRef);
    const categoryData = data.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
    }));
    setCategories([{ id: "all", category: "All Category" }, ...categoryData]);
  };

  // Fetch products from Firebase
  const fetchProducts = async () => {
    const data = await getDocs(productCollectionRef);
    const productsData = data.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
    }));
    setProducts(productsData);
    setFilteredProducts(productsData);
  };

  // Filter products based on selected category
  const handleCategoryChange = (value) => {
    setSelectedCategory(value);
    filterProducts(value, searchQuery);
  };

  // Filter products based on search query
  const handleSearchChange = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    filterProducts(selectedCategory, query);
  };

  // Combined filtering function
  const filterProducts = (category, query) => {
    let filtered = products;

    if (category && category !== "All Category") {
      filtered = filtered.filter((product) => product.category === category);
    }

    if (query) {
      filtered = filtered.filter((product) =>
        product.product.toLowerCase().includes(query)
      );
    }

    setFilteredProducts(filtered);
  };

  // Add a new product to the selected category
  const addProduct = async () => {
    if (selectedCategory && newProduct && newPrice) {
      setIsAdding(true);
      await addDoc(productCollectionRef, {
        category: selectedCategory,
        product: newProduct,
        price: newPrice,
      });
      resetModal();
      message.success("Product added successfully!");
      fetchProducts();
      setIsAdding(false);
    } else {
      message.error("Please fill in all fields!");
    }
  };

  // Update an existing product
  const updateProduct = async () => {
    if (selectedCategory && newProduct && newPrice && currentProductId) {
      setIsUpdating(true);
      const productDoc = doc(db, "Product", currentProductId);
      await updateDoc(productDoc, {
        category: selectedCategory,
        product: newProduct,
        price: newPrice,
      });
      resetModal();
      message.success("Product updated successfully!");
      fetchProducts();
      setIsUpdating(false);
    } else {
      message.error("Please fill in all fields!");
    }
  };

  // Delete a product
  const deleteProduct = async (id) => {
    setIsDeleting(true);
    await deleteDoc(doc(db, "Product", id));
    message.success("Product deleted successfully!");
    fetchProducts();
    setIsDeleting(false);
  };

  const handleEdit = (product) => {
    setSelectedCategory(product.category);
    setNewProduct(product.product);
    setNewPrice(product.price);
    setCurrentProductId(product.id);
    setIsModalVisible(true);
  };

  const resetModal = () => {
    setNewProduct("");
    setNewPrice("");
    setIsModalVisible(false);
    setCurrentProductId(null);
  };

  // useEffect()
  useEffect(() => {
    const initializeData = async () => {
      await fetchCategories();
      await fetchProducts();
      setSelectedCategory(""); // Ensure the placeholder is shown initially
    };
    initializeData();
  }, []);

  // frontend table from Ant design
  const columns = [
    {
      title: (
        <Select
          placeholder="Select Category"
          value={selectedCategory || undefined} // Use undefined to show the placeholder when no value is selected
          onChange={handleCategoryChange}
          style={{ width: "100%" }}
          allowClear
        >
          {categories.map((category) => (
            <Select.Option key={category.id} value={category.category}>
              {category.category}
            </Select.Option>
          ))}
        </Select>
      ),
      dataIndex: "product",
      key: "product",
      render: (text) => <span>{text}</span>,
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      render: (text) => <span>{text} RS</span>,
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
            icon={<DeleteOutlined />}
            danger
            loading={isDeleting}
            onClick={() => deleteProduct(record.id)}
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
            paddingRight: "70px",
          }}
        >
          <Col>
            <Title level={3} style={{ margin: 0 }}>
              Products
            </Title>
          </Col>

          <Row gutter={16}>
            <Col>
              <Input
                placeholder="Search by product name"
                value={searchQuery}
                onChange={handleSearchChange}
                style={{ width: 200 }}
              />
            </Col>
            <Col>
              <Button type="primary" onClick={() => setIsModalVisible(true)}>
                Add Product
              </Button>
            </Col>
          </Row>
        </Row>
      </div>

      <div style={{ padding: "20px" }}>
        <Table
          dataSource={filteredProducts}
          columns={columns}
          rowKey="id"
          bordered
          pagination={{ pageSize: 5 }}
          style={{ backgroundColor: "#ffffff" }}
        />

        <Modal
          title={currentProductId ? "Update Product" : "Add New Product"}
          visible={isModalVisible}
          onOk={currentProductId ? updateProduct : addProduct}
          onCancel={resetModal}
          okButtonProps={{
            loading: currentProductId ? isUpdating : isAdding,
          }}
          okText={currentProductId ? "Update" : "Add"}
          cancelText="Cancel"
        >
          <Select
            placeholder="Select Category"
            value={selectedCategory || undefined}
            onChange={(value) => setSelectedCategory(value)}
            style={{ width: "100%", marginBottom: "10px" }}
          >
            {categories.map((category) => (
              <Select.Option key={category.id} value={category.category}>
                {category.category}
              </Select.Option>
            ))}
          </Select>

          <Input
            type="text"
            value={newProduct}
            onChange={(e) => setNewProduct(e.target.value)}
            placeholder="Enter product name"
            style={{ marginBottom: "10px" }}
          />
          <Input
            type="number"
            value={newPrice}
            onChange={(e) => setNewPrice(e.target.value)}
            placeholder="Enter price"
          />
        </Modal>
      </div>
    </>
  );
};

export default Product;
