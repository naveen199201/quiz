import React, { useEffect, useState } from "react";
import CategorizeStudentQuestion from "./CategorizeStudentQuestion";
import ClozeStudentQuestionWrapper from "./ClozeStudentQuestion";
import ComprehensionStudentQuestion from "./ComprehensionStudentQuestion";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import axios from "axios";
import { ToastContainer,toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import "./QuizForm.css";

const QuizForm = ({ questions }) => {
  const [answers, setAnswers] = useState({});
  const [reviewedQuestions, setReviewedQuestions] = useState([]);
  const [questionsCount, setQuestionsCount] =useState(0)
  const baseUrl = "https://backend-eight-virid-92.vercel.app/api/submissions";
  const [answeredQuestionsCount, setAnsweredQuestionsCount] = useState(0);

  const handleAnswerChange = (question, answer) => {
    setAnswers((prev) => ({
      ...prev,
      [question]: answer,
    }));
  };

  const onResetAnswers = (question_id, mcq_id = '') => {
    const newData = { ...answers };
    if (mcq_id !== '') {
      if (newData[question_id] && typeof newData[question_id] === 'object') {
        delete newData[question_id][mcq_id];
      }
    } else {
      delete newData[question_id];
    }
    setAnswers(newData);
  };
  const toggleReview = (questionId) => {
    setReviewedQuestions((prev) =>
      prev.includes(questionId)
        ? prev.filter((id) => id !== questionId)
        : [...prev, questionId] 
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
        length += 0;
      }
      return length;
    });
    return length;
  };

  const handleSubmit = async() => {
    console.log("Submitted Answers:", answers);
    const res = await axios.post(baseUrl, { data: answers });
    if(res.status){
      toast.success('Your answers have been submitted!')
    }
  };
  useEffect(() => {
    let compQuestions = 0;
    let noOfQuestions = 0;

    questions.comprehensionQuestions.forEach((element) => {
      compQuestions += element.questions.length;
    });
    noOfQuestions =
      questions.categorizeQuestions.length +
      questions.clozeQuestions.length +
      compQuestions;
      setQuestionsCount(noOfQuestions)
  },[questions])

  useEffect(()=>{
    setAnsweredQuestionsCount(getNoOfAnswers);
  },[answers])

  return (
    <div style={{ display:'flex', justifyContent:'space-around', gap: '20px'}}>
    <div className="student-quiz">
      <h1>Quiz</h1>
      <progress value={answeredQuestionsCount} max={questionsCount} />
      <form onSubmit={(e) => e.preventDefault()}>
        {/* Categorize Questions */}
        <div>
          {questions?.categorizeQuestions?.map((question, index) => (
            <div key={index} className="question-section">
              <h3>Categorize Question {index + 1}</h3>
              <CategorizeStudentQuestion
                question={question}
                reviewedQuestions={reviewedQuestions}
                toggleReview={toggleReview}
                answer={answers[question._id] || {}}
                onAnswerChange={handleAnswerChange}
                onReset={() =>
                  onResetAnswers(question._id)
                }
              />
            </div>
          ))}
        </div>

        {/* Cloze Questions */}
        <div>
          {questions?.clozeQuestions?.map((question, index) => (
            <div key={index} className="question-section">
              <h3>Cloze Question {index + 1}</h3>
              <DndProvider backend={HTML5Backend}>
                <ClozeStudentQuestionWrapper
                  question={question}
                  reviewedQuestions={reviewedQuestions}
                toggleReview={toggleReview}
                  answer={answers[question._id] || ""}
                  onAnswerChange={(answer) =>
                    handleAnswerChange(question._id, answer)
                  }
                  onReset={() =>
                    onResetAnswers(question._id)
                  }
                />
              </DndProvider>
            </div>
          ))}
        </div>

        {/* Comprehension Questions */}
        <div>
          {questions?.comprehensionQuestions?.map((question, index) => (
            <div key={index} className="question-section">
              <h3>Comprehension {index + 1}</h3>
              <ComprehensionStudentQuestion
                question={question}
                reviewedQuestions={reviewedQuestions}
                toggleReview={toggleReview}
                answer={answers[question._id] || {}}
                onAnswerChange={(answer) =>
                  handleAnswerChange(question._id, answer)
                }
                onReset={(mcq_index) =>
                  onResetAnswers(question._id, mcq_index)
                }
              />
            </div>
          ))}
        </div>
        <button className="submit-button" type="button" onClick={handleSubmit}>
          Submit Quiz
        </button>
      </form>
      </div>
      <div className="summary-text">
          <p><b>Answered Questions:</b> {answeredQuestionsCount}</p>
          <p><b>Un Answered Questions:</b> {questionsCount-answeredQuestionsCount}</p>
          <p><b>Mark For Review Questions:</b> {reviewedQuestions.length}</p>
      </div>
      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
    </div>
  );
};

export default QuizForm;
