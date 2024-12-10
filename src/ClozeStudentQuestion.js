import React, { useState } from "react";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { CiBookmark } from "react-icons/ci";
import { FaBookmark } from "react-icons/fa";
import { TfiReload } from "react-icons/tfi";
import "./ClozeStudentQuestion.css";

// **Blank Component**
const Blank = ({ index, onDrop, filledWord }) => {
  const [{ isOver }, drop] = useDrop({
    accept: "OPTION",
    drop: (item) => onDrop(index, item.word),
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  });

  return (
    <span ref={drop} className={`blank ${isOver ? "hovered" : ""}`}>
      {filledWord || ""}
    </span>
  );
};

// **Option Component**
const Option = ({ word, isUsed }) => {
  const [{ isDragging }, drag] = useDrag({
    type: "OPTION",
    item: { word },
    canDrag: !isUsed, // Prevent dragging if already used
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  });

  return (
    <div
      ref={drag}
      className={`option ${isDragging ? "dragging" : ""} ${isUsed ? "used" : ""
        }`}
    >
      {word}
    </div>
  );
};

const ClozeStudentQuestion = ({
  question,
  reviewedQuestions,
  toggleReview,
  onAnswerChange,
  onReset,
}) => {
  const { questionText, underlinedWords } = question;

  // Split the question text to create blanks
  const textParts = questionText.split("____");

  const [answers, setAnswers] = useState(
    Array(textParts.length - 1).fill(null)
  );

  // Handle drop into blanks
  const handleDrop = (index, word) => {
    const updatedAnswers = [...answers];
    updatedAnswers[index] = word;
    setAnswers(updatedAnswers);
    onAnswerChange(updatedAnswers);
  };

  const isOptionUsed = (word) => answers.includes(word);

  const handleRefresh = () => {
    console.log('refresh');
    setAnswers(Array(textParts.length - 1).fill(null));
    onAnswerChange(Array(textParts.length - 1).fill(null));
    onReset();
  };

  return (
    <div className="cloze-student-question">
      <div className="quiz-action-buttons">
        <button className="review-button" onClick={() => toggleReview(question._id)}>
          {reviewedQuestions.includes(question._id) ? <FaBookmark />
            : <CiBookmark />
          }
        </button>
        <button
          className="reset-button"
          onClick={() => handleRefresh()}
        >
          <TfiReload />
        </button>
      </div>
      <div className="options-container">
        {underlinedWords.map((word, index) => (
          <Option key={word} word={word} isUsed={isOptionUsed(word)} />
        ))}
      </div>
      {/* Render Question Text */}
      <div className="question-text">
        {textParts.map((part, index) => (
          <React.Fragment key={index}>
            <span>{part}</span>
            {index < textParts.length - 1 && (
              <Blank
                index={index}
                onDrop={handleDrop}
                filledWord={answers[index]}
              />
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

const ClozeStudentQuestionWrapper = (props) => (
  <DndProvider backend={HTML5Backend}>
    <ClozeStudentQuestion {...props} />
  </DndProvider>
);

export default ClozeStudentQuestionWrapper;
