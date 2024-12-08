import React, { useState } from "react";
import CategorizeStudentQuestion from "./CategorizeStudentQuestion";
import ClozeStudentQuestionWrapper from "./ClozeStudentQuestion";
import ComprehensionStudentQuestion from "./ComprehensionStudentQuestion";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import axios from "axios";
import "./QuizForm.css";

const QuizForm = ({ questions }) => {
  const [answers, setAnswers] = useState({});
  const [reviewedQuestions, setReviewedQuestions] = useState([]);
  const baseUrl = "http://localhost:5000/api/submissions";
  const handleAnswerChange = (question, answer) => {
    setAnswers((prev) => ({
      ...prev,
      [question]: answer,
    }));
  };
  const toggleReview = (questionId) => {
    setReviewedQuestions((prev) =>
      prev.includes(questionId)
        ? prev.filter((id) => id !== questionId) // Remove if already marked
        : [...prev, questionId] // Add if not marked
    );
  };
  const getNoOfAnswers = () => {
    let length=0;
    const innerLengths = Object.entries(answers).map(([key, value]) => {

      if (Array.isArray(value)) {
        length += 1;
      } else if (typeof value === "object" && value !== null) {
        if (typeof Object.values(value)[0] == "string") {
          length += Object.keys(value).length;
        } else {
          length += 1;
        }
      } else {
        length += 0; // For non-array, non-object values
      }
      return length;
    });
    return length;
  };

  const handleSubmit = () => {
    console.log("Submitted Answers:", answers);
    axios.post(baseUrl, { data: answers });
    alert("Your answers have been submitted!");
  };
  let compQuestions = 0;
  questions.comprehensionQuestions.forEach((element) => {
    compQuestions += element.questions.length;
  });
  const noOfQuestions =
    questions.categorizeQuestions.length +
    questions.clozeQuestions.length +
    compQuestions;
  const answeredQuestions = getNoOfAnswers();
  console.log(noOfQuestions, answeredQuestions);
  console.log(answers);
  console.log(reviewedQuestions);
  return (
    <div className="student-quiz">
      <h1>Quiz</h1>
      <progress value={answeredQuestions} max={noOfQuestions} />
      <form onSubmit={(e) => e.preventDefault()}>
        {/* Categorize Questions */}
        <div>
          {questions.categorizeQuestions.map((question, index) => (
            <div key={index} className="question-section">
              <h3>Question {index + 1}</h3>
              <CategorizeStudentQuestion
                question={question}
                reviewedQuestions={reviewedQuestions}
                toggleReview={toggleReview}
                answer={answers[question._id] || {}}
                onAnswerChange={handleAnswerChange}
              />
            </div>
          ))}
        </div>

        {/* Cloze Questions */}
        <div>
          {questions.clozeQuestions.map((question, index) => (
            <div key={index} className="question-section">
              <h3>Question {index + 1}</h3>
              <DndProvider backend={HTML5Backend}>
                <ClozeStudentQuestionWrapper
                  question={question}
                  reviewedQuestions={reviewedQuestions}
                toggleReview={toggleReview}
                  answer={answers[question._id] || ""}
                  onAnswerChange={(answer) =>
                    handleAnswerChange(question._id, answer)
                  }
                />
              </DndProvider>
            </div>
          ))}
        </div>

        {/* Comprehension Questions */}
        <div>
          {questions.comprehensionQuestions.map((question, index) => (
            <div key={index} className="question-section">
              <h3>Question {index + 1}</h3>
              <ComprehensionStudentQuestion
                question={question}
                reviewedQuestions={reviewedQuestions}
                toggleReview={toggleReview}
                answer={answers[question._id] || {}}
                onAnswerChange={(answer) =>
                  handleAnswerChange(question._id, answer)
                }
              />
            </div>
          ))}
        </div>

        {/* Submit Button */}
        <button type="button" onClick={handleSubmit}>
          Submit Quiz
        </button>
      </form>
    </div>
  );
};

export default QuizForm;
