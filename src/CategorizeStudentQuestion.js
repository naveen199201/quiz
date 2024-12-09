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



// Category Component (Droppable)
const CategoryArea = ({ category, onDropItem, items, color }) => {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: "ITEM",
    drop: (item) => onDropItem(category, item),
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }));
  return (
    <div>
      <div
        className="category-name"
        style={{ backgroundColor: color, color: '#fff' }}
      >
        {category}
      </div>
      <div
        ref={drop}
        style={{
          padding: "20px",
          margin: "10px",
          borderRadius: "10px",
          backgroundColor: color,
          minHeight: "100px",
          width: "150px",
          textAlign: "center",
          fontSize: "16px",
          color: '#fff',
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
const CategorizeStudentQuestion = ({ question,reviewedQuestions,toggleReview, onAnswerChange, onReset }) => {
  // Initialize the state with empty categories
  const [answers, setAnswers] = useState(() => {
    const initialAnswers = {};
    question.categories.forEach((category) => {
      initialAnswers[category] = [];
    });
    return initialAnswers;
  });

  const [colors, setColors] = useState(['#d7e8b1','#f5c4c4'])
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
    onReset();
  };

  return (
    <div style={{marginBottom: "20px" }}>
      <div style={{ display:'flex', justifyContent:'flex-end', gap:'20px'}}>
      <button onClick={() => toggleReview(question._id)}>
          {reviewedQuestions.includes(question._id) ? "Unmark" : "Mark for Review"}
      </button>
      {/* Reset Button */}
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
        Reset
      </button>
      </div>
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
            color={colors[index]}
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
