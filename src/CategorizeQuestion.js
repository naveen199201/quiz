import React, { useEffect, useState } from "react";
import { useDrag, useDrop, DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { FaRegImage } from "react-icons/fa6";
import { FaPlusCircle } from "react-icons/fa";
import { PiCopy } from "react-icons/pi";
import { RiDeleteBinLine } from "react-icons/ri";
import "./CategorizeQuestion.css";

const CategorizeQuestion = ({
  questionIndex,
  onDelete,
  handleSave,
  questionData,
  onAdd,
  onDuplicate,
}) => {

  const [categories, setCategories] = useState(questionData.categories || []);
  const [items, setitems] = useState(questionData.items || []);
  const [newCategory, setNewCategory] = useState("");
  const [newItem, setNewItem] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [description, setDescription] = useState(
    questionData.description || ""
  );
  const [image, setImage] = useState(questionData.image || "");

  const handleAddCategory = () => {
    if (newCategory.trim() && !categories.includes(newCategory.trim())) {
      setCategories([...categories, newCategory.trim()]);
      setNewCategory(""); // Reset input after adding
    }
  };

  const handleAddItem = () => {
    if (newItem.trim() && selectedCategory) {
      setitems([
        ...items,
        {
          answer: newItem.trim(),
          category: selectedCategory,
        },
      ]);
      setNewItem("");
      setSelectedCategory("");
    }
  };

  const handleDeleteCategory = (categoryName) => {
    const updatedCategories = categories.filter(
      (category) => category !== categoryName
    );
    setCategories(updatedCategories);
    const updatedItems = items.filter((item) => item.category !== categoryName);
    setitems(updatedItems); 
  };

  const handleDeleteItem = (itemId) => {
    const updatedItems = items.filter((item) => item._id !== itemId);
    setitems(updatedItems);
  };

  const handleEditItem = (itemId, newName) => {
    const updatedItems = items.map((item) =>
      item._id === itemId ? { ...item, answer: newName } : item
    );
    setitems(updatedItems);
  };

  const handleCategoryChangeForItem = (itemId, newCategory) => {
    const updatedItems = items.map((item) =>
      item._id === itemId ? { ...item, category: newCategory } : item
    );
    setitems(updatedItems);
  };

  useEffect(() => {
    handleSave(
      questionIndex,
      { '_id':questionData._id ,categories, items, description, image },
      "categorize"
    );
  }, [categories, items, description, image]);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(URL.createObjectURL(file));
    }
  };

  return (
    <div className="categorize-questions-container">
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
                <label
                  htmlFor={`${questionIndex}-categorize-image-upload`}
                  className="image-upload-label"
                >
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
                  id={`${questionIndex}-categorize-image-upload`}
                  style={{ display: "none" }} // Hide the file input
                  accept="image/*"
                  onChange={handleImageUpload}
                />
              </div>

              {image && (
                <div style={{ marginTop: "10px" }}>
                  <img
                    src={image}
                    alt="Uploaded"
                    style={{ maxWidth: "200px", display: "block" }}
                  />
                </div>
              )}
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

            <div className="add-category">
              <input
                type="text"
                placeholder="New Category"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
              />
              <button onClick={handleAddCategory}>+</button>
            </div>
            <h4>Items</h4>
            <div className="items-section">
              {items.map((item, index) => (
                <div key={index} className="item">
                  <input
                    type="text"
                    value={item.answer}
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
      </div>
      <div className="action-buttons">
        <button className="add-question" onClick={() => onAdd("categorize")}>
          <FaPlusCircle />
        </button>
        <button
          className="duplicate-question"
          onClick={() => {
            let newData = { categories, items, description, image };
            onDuplicate("categorize", newData, questionIndex + 1);
          }}
        >
          <PiCopy />
        </button>
        <button
          className="delete-question"
          onClick={() =>
            onDelete("categorize", questionIndex, questionData._id)
          }
        >
          <RiDeleteBinLine />
        </button>
      </div>
    </div>
  );
};

export default CategorizeQuestion;
