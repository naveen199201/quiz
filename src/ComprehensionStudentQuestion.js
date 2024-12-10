import React from "react";
import "./ComprehensionStudentQuestion.css";
import { CiBookmark } from "react-icons/ci";
import { FaBookmark } from "react-icons/fa";
import { TfiReload } from "react-icons/tfi";

const ComprehensionStudentQuestion = ({ question, answer, reviewedQuestions, toggleReview, onAnswerChange, onReset }) => {
  const handleReset = (index) => {
    const updatedAnswer = { ...answer };
    delete updatedAnswer[index];
    onAnswerChange(updatedAnswer);
    onReset(index);
  };

  const handleAnswerSelect = (qindex, selectedOption) => {
    const updatedAnswer = { ...answer, [qindex]: selectedOption };
    const updatedQuestion = {
      ...question,
      selectedAnswer: selectedOption,
    };
    onAnswerChange(updatedAnswer, updatedQuestion._id);
  };
  return (
    <>
      <p className="paragraph">{question.paragraph}</p>
      <div className="comprehension-quiz-question">
        {question.questions.map((mcq, qindex) => (
          <div key={qindex} className="mcq">
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
