import React, { useEffect, useState } from "react";
import { db } from "../Config/Firebase";
import { getDocs, collection, query, where, addDoc } from "firebase/firestore";
import {
  List,
  Button,
  Card,
  message,
  Select,
  Input,
  Row,
  Col,
  Typography,
  Table,
  Radio,
} from "antd";
import { MinusOutlined, PlusOutlined, DeleteOutlined } from "@ant-design/icons";

const { Title } = Typography;

const Takeorder = () => {
  const [categories, setCategories] = useState([]); // state for fetch categories
  const [selectedProducts, setSelectedProducts] = useState([]); // state for fetch products
  const [totalPrice, setTotalPrice] = useState(0); // state for total price
  const [orderType, setOrderType] = useState(""); // state for order type (dine-in, take away, HD)
  const [selectedCategory, setSelectedCategory] = useState("All"); // state for see products with category
  const [searchTerm, setSearchTerm] = useState(""); // state for sesrch
  const [discount, setDiscount] = useState(0); // state for discount
  const [customerAmount, setCustomerAmount] = useState(0); // state for customer amount
  const [isPlacingOrder, setIsPlacingOrder] = useState(false); // state for button disable.

  // generate random ID for order
  let lastGeneratedDate = ""; // Stores the last date in DDMM format
  let orderCounter = 1; // Initialize the counter
  const generateOrderNumber = () => {
    const now = new Date();
    const day = String(now.getDate()).padStart(2, "0"); // Format day as DD
    const month = String(now.getMonth() + 1).padStart(2, "0"); // Format month as MM
    const currentDate = `${day}${month}`; // Combine DD and MM

    // Check if the date has changed
    if (currentDate !== lastGeneratedDate) {
      lastGeneratedDate = currentDate; // Update to the current date
      orderCounter = 1; // Reset the counter
    }

    const counterPart = String(orderCounter).padStart(2, "0"); // Format counter as 2-digit number
    orderCounter++; // Increment the counter for the next order
    return `ORD-${currentDate}${counterPart}`;
  };

  // fetch categories with products
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
      setSelectedProducts((prev) => [...prev, { ...product, quantity: 1 }]);
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

  // handle order-data to databse.
  const placeOrder = async () => {
    if (!orderType) {
      message.error("Please select an order type.");
      return;
    }

    setIsPlacingOrder(true); // Disable the button
    const orderNumber = generateOrderNumber();
    const orderData = {
      orderNumber,
      orderType,
      items: selectedProducts,
      totalPrice: totalAmountAfterDiscount,
      date: new Date().toISOString(),
    };

    try {
      const orderCollectionRef = collection(db, "Orders");
      await addDoc(orderCollectionRef, orderData);
      message.success(`Order ${orderNumber} placed successfully!`);

      // Generate and print invoice
      const invoiceContent = `
        <div>
          <h3>Invoice</h3>
          <p><strong>Order Number:</strong> ${orderNumber}</p>
          <p><strong>Order Date:</strong> ${new Date().toLocaleString()}</p>
          <p><strong>Order Type:</strong> ${orderType}</p>
          <table border="1" style="width: 100%; text-align: left;">
            <thead>
              <tr>
                <th>Item</th>
                <th>Quantity</th>
                <th>Price</th>
              </tr>
            </thead>
            <tbody>
              ${selectedProducts
                .map(
                  (item) => `
                <tr>
                  <td>${item.product}</td>
                  <td>${item.quantity}</td>
                  <td>${item.price * item.quantity} RS</td>
                </tr>`
                )
                .join("")}
            </tbody>
          </table>
          <p><strong>Total:</strong> ${totalAmountAfterDiscount.toFixed(
            2
          )} RS</p>
        </div>
      `;
      const printWindow = window.open("", "_blank");
      printWindow.document.write(invoiceContent);
      printWindow.document.close();
      printWindow.print();

      // Reset states
      setSelectedProducts([]);
      setTotalPrice(0);
      setOrderType("");
      setDiscount(0);
      setCustomerAmount(0);
    } catch (error) {
      message.error("Failed to place the order. Please try again.");
    } finally {
      setIsPlacingOrder(false); // Enable the button
    }
  };

  const filteredCategories =
    selectedCategory === "All"
      ? categories
      : categories.filter((category) => category.category === selectedCategory);

  const filteredProducts = (products) =>
    products.filter((product) =>
      product.product.toLowerCase().includes(searchTerm.toLowerCase())
    );

  // Calculate the total amount after applying the discount
  const totalAmountAfterDiscount = totalPrice - (totalPrice * discount) / 100;

  // Calculate remaining balance (if customer has paid more than totalAmount)
  const remainingBalance =
    customerAmount > 0 ? customerAmount - totalAmountAfterDiscount : 0;

  // Adding colomns for billing screen table
  const columns = (updateQuantity, removeProduct) => [
    {
      title: "Product",
      dataIndex: "product",
      key: "product",
      width: 120, // Set width to limit space
    },
    {
      title: "Qty",
      key: "quantity",
      width: 100,
      render: (_, record, index) => (
        <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
          <Button
            icon={<MinusOutlined />}
            onClick={() => updateQuantity(index, -1)}
            size="small" // Use smaller buttons
          />
          <span>{record.quantity}</span>
          <Button
            icon={<PlusOutlined />}
            onClick={() => updateQuantity(index, 1)}
            size="small"
          />
        </div>
      ),
    },
    {
      title: "",
      key: "action",
      width: 33,
      render: (_, record, index) => (
        <Button
          type="text"
          danger
          icon={<DeleteOutlined />}
          onClick={() => removeProduct(index)}
          size="small"
        />
      ),
    },
  ];

  // Frontend Started
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
            paddingRight: "56px",
          }}
        >
          <Col>
            <Title level={3} style={{ margin: 0 }}>
              Take Order
            </Title>
          </Col>
          <Col>
            <Input
              placeholder="Search Product"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ width: 200 }}
            />
          </Col>
        </Row>
      </div>

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

          {filteredCategories.map((category) => {
            const products = filteredProducts(category.products);
            return products.length > 0 ? (
              <Card
                key={category.id}
                title={category.category}
                style={{ marginBottom: "20px" }}
              >
                <List
                  dataSource={products}
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
            ) : null;
          })}
        </div>

        {/* Bill Screen */}
        <div
          style={{
            width: "310px",
            padding: " 10px 20px",
            background: "#f7f7f7",
          }}
        >
          <h4 style={{ textAlign: "center" }}>Selected Products</h4>
          <Table
            dataSource={selectedProducts.map((item, index) => ({
              ...item,
              key: index, // Add a unique key for each row
            }))}
            columns={columns(updateQuantity, removeProduct)}
            pagination={false} // Disable pagination
            size="small" // Compact table style
            scroll={{ y: 170 }} // Enable vertically scrolling
            style={{ width: "100%" }}
          />

          {/* Input tags for amount. */}

          <Row gutter={16} style={{ marginBlock: "10px" }}>
            {/* First Row: Apply Discount and Total Amount */}
            <Col span={12}>
              <p style={{ marginBottom: "6px" }}>
                <strong>Apply Discount</strong>
              </p>
              <Input
                type="number"
                value={discount}
                min={0}
                max={100}
                onChange={(e) => setDiscount(Number(e.target.value))}
                placeholder="Discount Percentage"
              />
            </Col>
            <Col span={12}>
              <p style={{ marginBottom: "6px" }}>
                <strong>Total Amount</strong>
              </p>
              <Input
                type="text"
                value={totalAmountAfterDiscount}
                readOnly
                placeholder="Total Amount After Discount"
              />
            </Col>
          </Row>
          <Row gutter={16} style={{ marginBlock: "10px" }}>
            {/* Second Row: Amount from Customer and Remaining Balance */}
            <Col span={12}>
              <p style={{ marginBottom: "6px" }}>
                <strong>Amount Ten.</strong>
              </p>
              <Input
                type="number"
                value={customerAmount}
                onChange={(e) => setCustomerAmount(Number(e.target.value))}
                placeholder="Amount from Customer"
              />
            </Col>
            <Col span={12}>
              <p style={{ marginBottom: "6px" }}>
                <strong>Rem. Bal.</strong>
              </p>
              <Input
                type="text"
                value={remainingBalance}
                readOnly
                placeholder="Remaining Balance"
              />
            </Col>
          </Row>

          {/* Radio Buttons. */}

          <div style={{ marginBottom: "10px" }}>
            <Radio.Group
              value={orderType}
              onChange={(e) => setOrderType(e.target.value)}
            >
              <Radio value="Dine-In">Dine-In</Radio>
              <Radio value="Home Delivery">Home Del.</Radio>
              <Radio value="Take Away">Take</Radio>
            </Radio.Group>
          </div>

          {/* Place Order Button. */}

          <Button
            type="primary"
            onClick={placeOrder}
            disabled={isPlacingOrder}
            style={{ width: "100%", marginTop: "10px" }}
          >
            Place Order
          </Button>
        </div>
      </div>
    </>
  );
};

export default Takeorder;
