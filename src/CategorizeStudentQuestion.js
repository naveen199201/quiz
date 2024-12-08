import React, { useState } from "react";
import { useDrag, useDrop, DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import "./CategorizeStudentQuestion.css";

// Item Component (Draggable)
const DraggableItem = ({ item, isItemDropped }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: "ITEM",
    item: { answer: item.answer },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  // If the item has already been dropped, we won't show it again
  if (isItemDropped) return null;

  return (
    <div
      ref={drag}
      style={{
        padding: "10px 15px",
        margin: "5px",
        border: "1px solid #000",
        borderRadius: "5px",
        backgroundColor: "transparent",
        cursor: "move",
        opacity: isDragging ? 0.5 : 1,
      }}
    >
      {item.answer}
    </div>
  );
};
const generateRandomColor = () => {
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};

const getFontColorBasedOnBackground = (bgColor) => {
  // Convert the hex color to RGB
  const r = parseInt(bgColor.slice(1, 3), 16);
  const g = parseInt(bgColor.slice(3, 5), 16);
  const b = parseInt(bgColor.slice(5, 7), 16);

  // Calculate luminance
  const luminance = 0.299 * r + 0.587 * g + 0.114 * b;

  // Return black or white font color based on luminance
  return luminance > 128 ? "#000" : "#fff";
};

// Example usage
console.log(generateRandomColor());

// Category Component (Droppable)
const CategoryArea = ({ category, onDropItem, items }) => {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: "ITEM",
    drop: (item) => onDropItem(category, item),
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }));
  const bgColor = generateRandomColor();
  const fontColor = getFontColorBasedOnBackground(bgColor);
  return (
    <div>
      <div
        className="category-name"
        style={{ backgroundColor: bgColor, fontColor }}
      >
        {category}
      </div>
      <div
        ref={drop}
        style={{
          padding: "20px",
          margin: "10px",
          borderRadius: "10px",
          backgroundColor: bgColor,
          minHeight: "100px",
          width: "150px",
          textAlign: "center",
          fontSize: "16px",
          fontColor,
        }}
      >
        {/* Display the items dropped into this category */}
        {items.map((item, index) => (
          <div
            key={index}
            style={{
              marginTop: "10px",
              background: "transparent",
              padding: "5px",
              border: "1px solid #555",
              borderRadius: "5px",
            }}
          >
            {item.answer}
          </div>
        ))}
      </div>
    </div>
  );
};

// Main CategorizeStudentQuestion Component
const CategorizeStudentQuestion = ({ question,reviewedQuestions,toggleReview, onAnswerChange }) => {
  // Initialize the state with empty categories
  const [answers, setAnswers] = useState(() => {
    const initialAnswers = {};
    question.categories.forEach((category) => {
      initialAnswers[category] = [];
    });
    return initialAnswers;
  });

  // State to keep track of which items are dropped
  const [droppedItems, setDroppedItems] = useState([]);

  // Handle dropping an item into a category
  const handleDropItem = (category, item) => {
    setAnswers((prevAnswers) => {
      const updatedAnswers = { ...prevAnswers };
      updatedAnswers[category].push(item);
      onAnswerChange(question._id,updatedAnswers); // Trigger the callback to update the parent
      return updatedAnswers;
    });

    // Mark the item as dropped
    setDroppedItems((prevDroppedItems) => [...prevDroppedItems, item.answer]);
  };

  // Refresh the question by resetting the state
  const refreshQuestion = () => {
    setAnswers(() => {
      const resetAnswers = {};
      question.categories.forEach((category) => {
        resetAnswers[category] = [];
      });
      return resetAnswers;
    });
    setDroppedItems([]); // Clear the dropped items
  };

  return (
    <div style={{ marginBottom: "20px" }}>
      <button onClick={() => toggleReview(question._id)}>
          {reviewedQuestions.includes(question._id) ? "Unmark" : "Mark for Review"}
      </button>
      {/* Refresh Button */}
      <button
        onClick={refreshQuestion}
        style={{
          padding: "10px 20px",
          border: "none",
          borderRadius: "5px",
          backgroundColor: "#007bff",
          color: "#fff",
          cursor: "pointer",
          fontSize: "16px",
          textAlign: "right"
        }}
      >
        Refresh
      </button>
      <h3>{question.questionText}</h3>
      <div
        style={{
          margin: "20px 0px",
          display: "flex",
          flexWrap: "wrap",
          gap: "10px",
          justifyContent: "center",
        }}
      >
        {/* Draggable Items (Answers to be dragged) */}
        {question.items.map((item, index) => (
          <DraggableItem
            key={index}
            item={item}
            isItemDropped={droppedItems.includes(item.answer)} // Check if item is already dropped
          />
        ))}
      </div>
      <div style={{ display: "flex", gap: "20px", justifyContent: "center" }}>
        {question.categories.map((category, index) => (
          <CategoryArea
            key={index}
            category={category}
            items={answers[category]} // Display the answers dropped into this category
            onDropItem={handleDropItem}
          />
        ))}
      </div>

      {/* Debugging: Display Current Answers */}
      {/* <div style={{ marginTop: "20px" }}>
        <h4>Answers:</h4>
        <pre>{JSON.stringify(answers, null, 2)}</pre>
      </div> */}
    </div>
  );
};

// Wrapping Component with DndProvider for proper context
const CategorizeStudentQuestionWrapper = (props) => {
  return (
    <DndProvider backend={HTML5Backend}>
      <CategorizeStudentQuestion {...props} />
    </DndProvider>
  );
};

export default CategorizeStudentQuestionWrapper;
