import React, { useEffect, useState } from "react";
import { db } from "../Config/Firebase";
import { collection, getDocs } from "firebase/firestore";

const Takeorder = () => {
  const [categories, setCategories] = useState([]);

  const fetchCategories = async () => {
    const categoryCollectionRef = collection(db, "Category");
    const data = await getDocs(categoryCollectionRef);
    setCategories(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h2>Available Categories are:</h2>
      <ul>
        {categories.map((category) => (
          <li key={category.id}>
            <strong>{category.category}</strong> - {category.description}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Takeorder;
