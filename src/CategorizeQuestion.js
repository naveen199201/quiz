import React, {useEffect,useState } from "react";
import { useDrag, useDrop, DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { v4 as uuidv4 } from 'uuid';
import { FaRegImage } from "react-icons/fa6";
import "./CategorizeQuestion.css";
import axios from "axios";
const CategorizeQuestion = ({
  questionIndex,
  onDelete,
  handleSave,
  questionData,
}) => {
  const [categories, setCategories] = useState(questionData.categories || []);
  // const [categories, setCategories] = useState([""]);

  const [items, setitems] = useState(questionData.items || []);
  const [newCategory, setNewCategory] = useState("");
  const [newItem, setNewItem] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [description, setDescription] = useState(questionData.description);
  const [image, setImage] = useState(questionData.image || "");

  // Add new category
  const handleAddCategory = () => {
    if (newCategory.trim() && !categories.includes(newCategory.trim())) {
      setCategories([...categories, newCategory.trim()]);
      setNewCategory(""); // Reset input after adding
    }
  };

  // Add new item with category
  const handleAddItem = () => {
    if (newItem.trim() && selectedCategory) {
      setitems([
        ...items,
        {
          // id: items.length + 1,
          answer: newItem.trim(),
          category: selectedCategory,
        },
      ]);
      setNewItem(""); // Reset item input
      setSelectedCategory(""); // Reset category selection
    }
  };

  // Handle deleting category
  const handleDeleteCategory = (categoryName) => {
    const updatedCategories = categories.filter(
      (category) => category !== categoryName
    );
    setCategories(updatedCategories);
    const updatedItems = items.filter((item) => item.category !== categoryName);
    setitems(updatedItems); // Also remove items belonging to deleted category
  };

  // Handle deleting item
  const handleDeleteItem = (itemId) => {
    const updatedItems = items.filter((item) => item._id !== itemId);
    setitems(updatedItems);
  };

  // Handle editing item
  const handleEditItem = (itemId, newName) => {
    const updatedItems = items.map((item) =>
      item._id === itemId ? { ...item, answer: newName } : item
    );
    setitems(updatedItems);
  };

  // Handle changing category for item
  const handleCategoryChangeForItem = (itemId, newCategory) => {
    const updatedItems = items.map((item) =>
      item._id === itemId ? { ...item, category: newCategory } : item
    );
    setitems(updatedItems);
  };

  useEffect(() => {
    handleSave(questionIndex, { categories, items,description, image }, "categorize");
  }, [categories, items, description, image]);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    console.log('file')
    if (file) {
      console.log('file name')
      const formData = new FormData();
      formData.append("image", file);
  
      try {
        const response = await axios.post("http://localhost:5000/imageupload", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
  
        const { imageId } = response.data; // MongoDB ID of the image
        const imageUrl = `http://localhost:5000/api/uploads/${imageId}`;
        setImage(imageUrl); // Set the image URL for display
      } catch (error) {
        console.error("Error uploading the image", error);
      }
    }
  };

  return (
    <div className="categorize">
      <DndProvider backend={HTML5Backend}>
        <div className="categorize-question">
          <div className="question">
            <h3>Question</h3>
          </div>

          {/* Categories Section */}
          <div className="categories-section">
            <div style={{ display: "flex", alignItems: "center" }}>
              <input
                className="description"
                type="text"
                value={description}
                onChange={(e) => {
                  setDescription(e.target.value);
                }}
                placeholder="Description (optional)"
              />
              {/* Image Upload Icon */}

              <label htmlFor={`q${questionIndex}`} className="image-upload-label">
                <FaRegImage
                  style={{
                    cursor: "pointer",
                    marginLeft: "10px",
                    fontSize: "24px",
                  }}
                />
              </label>
              <input
                type="file"
                id={`q${questionIndex}`}
                style={{ display: "none" }} // Hide the file input
                accept="image/*"
                onChange={handleImageUpload}
              />

              {/* Display the uploaded image */}
              {image && (
                <img
                  src={image}
                  alt="Uploaded"
                  style={{ marginTop: "10px", maxWidth: "200px" }}
                />
              )}
            </div>
            <h4>Categories</h4>
            {categories.map((category, index) => (
              <div key={index} className="category">
                <input
                  type="text"
                  value={category}
                  onChange={(e) => {
                    const updatedCategories = [...categories];
                    updatedCategories[index] = e.target.value;
                    setCategories(updatedCategories);
                    // if (index === categories.length - 1 && category !== "") {
                    //   setCategories([...updatedCategories, ""]);
                    // }
                  }}
                />
                {category && (
                  <button
                    className="delete-category"
                    onClick={() => handleDeleteCategory(category)}
                  >
                    x
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* Add Category */}
          <div className="add-category">
            <input
              type="text"
              placeholder="New Category"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
            />
            <button onClick={handleAddCategory}>+</button>
          </div>

          {/* Items Section */}
          <h4>Items</h4>
          <div className="items-section">
            {items.map((item, index) => (
              <div key={item._id} className="item">
                <input
                  type="text"
                  value={item.answer} // Use `item.answer` instead of `item.name`
                  onChange={(e) => handleEditItem(item._id, e.target.value)}
                />
                <button
                  className="delete-item"
                  onClick={() => handleDeleteItem(item._id)}
                >
                  x
                </button>
                <select
                  value={item.category}
                  onChange={(e) =>
                    handleCategoryChangeForItem(item._id, e.target.value)
                  }
                >
                  <option value="">Select Category</option>
                  {categories.map(
                    (category, index) =>
                      category.trim() !== "" && (
                        <option key={index} value={category}>
                          {category}
                        </option>
                      )
                  )}
                </select>
              </div>
            ))}
          </div>

          {/* Add Item */}
          <div className="add-item">
            <input
              type="text"
              placeholder="New Item"
              value={newItem}
              onChange={(e) => setNewItem(e.target.value)}
            />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="">Select Category</option>
              {categories.map((category, index) => (
                <option key={index} value={category}>
                  {category}
                </option>
              ))}
            </select>
            <button onClick={handleAddItem} disabled={!selectedCategory}>
              +
            </button>
          </div>
        </div>
      </DndProvider>
      <button className="delete-question" onClick={onDelete}>
        Delete Question
      </button>
    </div>
  );
};

export default CategorizeQuestion;
