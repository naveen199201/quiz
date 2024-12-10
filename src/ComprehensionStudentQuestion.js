import React from "react";
import "./ComprehensionStudentQuestion.css";
import { CiBookmark } from "react-icons/ci";
import { FaBookmark } from "react-icons/fa";
import { TfiReload } from "react-icons/tfi";

const ComprehensionStudentQuestion = ({ question, answer, reviewedQuestions, toggleReview, onAnswerChange, onReset }) => {
  // Function to reset the answer for a specific question
  const handleReset = (index) => {
    const updatedAnswer = { ...answer };
    delete updatedAnswer[index]; // Remove the selected answer for the question
    onAnswerChange(updatedAnswer); // Notify parent about the updated answer
    onReset(index);
  };

  const handleAnswerSelect = (qindex, selectedOption) => {
    const updatedAnswer = { ...answer, [qindex]: selectedOption };
    const updatedQuestion = {
      ...question,
      selectedAnswer: selectedOption, // Include the selected answer
    };
    onAnswerChange(updatedAnswer, updatedQuestion._id); // Notify parent with both selected and correct answer
  };
  return (
    <>
      <p className="paragraph">{question.paragraph}</p>

      <div className="comprehension-quiz-question">
        {question.questions.map((mcq, qindex) => (
          <div key={qindex} className="mcq">
            {/* Reset Button for the Question */}
            <p className="mcq-question">
              {qindex + 1}. {mcq.text}
            </p>
            <div className="quiz-action-buttons">

              <button className="review-button" onClick={() => toggleReview(question._id)}>
                {reviewedQuestions.includes(question._id) ? <FaBookmark />
                  : <CiBookmark />
                }
              </button>
              <button
                className="reset-button"
                onClick={() => handleReset(qindex)}
              >
                <TfiReload />
              </button>
            </div>
            <div className="mcq-options-container">
              {mcq.options.map((option, optionIndex) => (
                <div key={optionIndex} className="option">
                  <input
                    type="radio"
                    id={`q${qindex}_t${question._id}_o${optionIndex}`}
                    name={`q${qindex}_t${question._id}_o${optionIndex}`}
                    value={option}
                    checked={answer[qindex] === option}
                    onChange={() => handleAnswerSelect(qindex, option)} // Pass selected option and correct answer
                  />
                  <label
                    htmlFor={`q${qindex}_t${question._id}_o${optionIndex}`}
                  >
                    {option}
                  </label>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default ComprehensionStudentQuestion;
