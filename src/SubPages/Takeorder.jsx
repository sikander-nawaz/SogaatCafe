import React, { useEffect, useState } from "react";
import { db } from "../Config/Firebase";
import { getDocs, collection, query, where, addDoc } from "firebase/firestore";
import { List, Button, Card, message, Select } from "antd";

const Takeorder = () => {
  const [categories, setCategories] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [orderType, setOrderType] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const generateOrderNumber = () => `ORD-${Math.floor(Math.random() * 1000000)}`;

  const fetchCategoriesWithProducts = async () => {
    const categoryCollectionRef = collection(db, "Category");
    const productCollectionRef = collection(db, "Product");

    const categoryData = await getDocs(categoryCollectionRef);
    const categoriesWithProducts = await Promise.all(
      categoryData.docs.map(async (catDoc) => {
        const category = { ...catDoc.data(), id: catDoc.id };
        const productQuery = query(
          productCollectionRef,
          where("category", "==", category.category)
        );
        const productData = await getDocs(productQuery);
        const products = productData.docs.map((prodDoc) => ({
          ...prodDoc.data(),
          id: prodDoc.id,
        }));

        return { ...category, products };
      })
    );

    setCategories(categoriesWithProducts);
  };

  useEffect(() => {
    fetchCategoriesWithProducts();
  }, []);

  const handleProductClick = (product) => {
    const existingProductIndex = selectedProducts.findIndex(
      (item) => item.id === product.id
    );

    if (existingProductIndex > -1) {
      const updatedProducts = [...selectedProducts];
      updatedProducts[existingProductIndex].quantity += 1;
      setSelectedProducts(updatedProducts);
      setTotalPrice((prev) => prev + parseFloat(product.price));
    } else {
      setSelectedProducts((prev) => [
        ...prev,
        { ...product, quantity: 1 },
      ]);
      setTotalPrice((prev) => prev + parseFloat(product.price));
    }
  };

  const updateQuantity = (index, delta) => {
    const updatedProducts = [...selectedProducts];
    const product = updatedProducts[index];
    const newQuantity = product.quantity + delta;

    if (newQuantity <= 0) {
      updatedProducts.splice(index, 1);
      setTotalPrice((prev) => prev - product.price * product.quantity);
    } else {
      product.quantity = newQuantity;
      setTotalPrice((prev) => prev + product.price * delta);
    }

    setSelectedProducts(updatedProducts);
  };

  const removeProduct = (index) => {
    const updatedProducts = [...selectedProducts];
    const product = updatedProducts[index];
    setTotalPrice((prev) => prev - product.price * product.quantity);
    updatedProducts.splice(index, 1);
    setSelectedProducts(updatedProducts);
  };

  const placeOrder = async () => {
    if (!orderType) {
      message.error("Please select an order type.");
      return;
    }

    const orderNumber = generateOrderNumber();
    const orderData = {
      orderNumber,
      orderType,
      items: selectedProducts,
      totalPrice,
      date: new Date().toISOString(),
    };

    try {
      const orderCollectionRef = collection(db, "Orders");
      await addDoc(orderCollectionRef, orderData);
      message.success(`Order ${orderNumber} placed successfully!`);
      setSelectedProducts([]);
      setTotalPrice(0);
      setOrderType("");
    } catch (error) {
      message.error("Failed to place the order. Please try again.");
    }
  };

  const filteredCategories = selectedCategory === "All"
    ? categories
    : categories.filter((category) => category.category === selectedCategory);

  return (
    <div style={{ padding: "20px", display: "flex" }}>
      <div style={{ flex: 1, marginRight: "20px" }}>
        <Select
          placeholder="Select Category"
          style={{ width: "100%", marginBottom: "20px" }}
          value={selectedCategory}
          onChange={setSelectedCategory}
          allowClear
        >
          <Select.Option value="All">All Category</Select.Option>
          {categories.map((category) => (
            <Select.Option key={category.id} value={category.category}>
              {category.category}
            </Select.Option>
          ))}
        </Select>
        
        {filteredCategories.map((category) => (
          <Card key={category.id} title={category.category} style={{ marginBottom: "20px" }}>
            <List
              dataSource={category.products}
              renderItem={(product) => (
                <List.Item>
                  <Button
                    type="link"
                    onClick={() => handleProductClick(product)}
                  >
                    {product.product} - {product.price} RS
                  </Button>
                </List.Item>
              )}
            />
          </Card>
        ))}
      </div>

      <div style={{ width: "300px", padding: "20px", background: "#f7f7f7" }}>
        <h3>Selected Products</h3>
        <List
          dataSource={selectedProducts}
          renderItem={(item, index) => (
            <List.Item
              actions={[
                <Button onClick={() => updateQuantity(index, -1)}>-</Button>,
                <span>{item.quantity}</span>,
                <Button onClick={() => updateQuantity(index, 1)}>+</Button>,
                <Button danger onClick={() => removeProduct(index)}>Remove</Button>
              ]}
            >
              {item.product} - {item.price} RS each
            </List.Item>
          )}
        />
        <h3>Total: {totalPrice} RS</h3>

        <h4>Select Order Type</h4>
        <div style={{ marginBottom: "10px" }}>
          <Button
            type={orderType === "Dine-In" ? "primary" : "default"}
            onClick={() => setOrderType("Dine-In")}
            style={{ marginRight: "5px" }}
          >
            Dine-In
          </Button>
          <Button
            type={orderType === "Home Delivery" ? "primary" : "default"}
            onClick={() => setOrderType("Home Delivery")}
            style={{ marginRight: "5px" }}
          >
            Home Delivery
          </Button>
          <Button
            type={orderType === "Take Away" ? "primary" : "default"}
            onClick={() => setOrderType("Take Away")}
          >
            Take Away
          </Button>
        </div>

        <Button
          type="primary"
          onClick={placeOrder}
          style={{ width: "100%", marginTop: "10px" }}
        >
          Place Order
        </Button>
      </div>
    </div>
  );
};

export default Takeorder;
