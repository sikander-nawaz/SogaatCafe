// import React from "react";

// const Category = () => {
//   return <div>Category Category Category Category</div>;
// };

// export default Category;

import React, { useState } from "react";
import { db } from "../Config/Firebase";

const Category = () => {
  const [category, setCategory] = useState("");

  const addCategory = async () => {
    if (category) {
      await db.collection("categories").add({ name: category });
      setCategory(""); // Clear the input
    }
  };

  return (
    <div>
      <h2>Add Category</h2>
      <input
        type="text"
        placeholder="Enter category name"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
      />
      <button onClick={addCategory}>Add Category</button>
    </div>
  );
};

export default Category;
