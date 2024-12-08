import React, { useState, useEffect } from "react";
import FormEditor from "./FormEditor";
import QuizForm from "./QuizForm";
import axios from "axios";

const QuizApp = () => {
  // const baseUrl = "http://localhost:5000/api/questions";
  const baseUrl = "https://backend-eight-virid-92.vercel.app/api/questions";
  const [questions, setQuestions] = useState({});
  const [activeTab, setActiveTab] = useState("formEditor");

  useEffect(() => {
    const fetchQuestions = async () => {
      const params = { quiz: false };
      try {
        const response = await axios.get(baseUrl, params);
        console.log(response.data);
        setQuestions(response.data);
      } catch (error) {
        console.error("Error fetching questions:", error);
      }
    };

    fetchQuestions();
  }, []); // Empty dependency array ensures this runs once when the component mounts.

  const handleQuestionsUpdate = (updatedQuestions) => {
    setQuestions(updatedQuestions);
  };

  return (
    <div className="tabbed-quiz-app">
      {/* Tabs Navigation */}
      <div className="tabs">
        <button
          className={activeTab === "formEditor" ? "active" : ""}
          onClick={() => setActiveTab("formEditor")}
        >
          Form Editor
        </button>
        <button
          className={activeTab === "quiz" ? "active" : ""}
          onClick={() => setActiveTab("quiz")}
        >
          Student Quiz
        </button>
      </div>

      {/* Tab Content */}
      <div className="tab-content">
        {activeTab === "formEditor" && (
          <FormEditor
          // questions={questions}
          // onQuestionsChange={handleQuestionsUpdate}
          />
        )}
        {activeTab === "quiz" && <QuizForm questions={questions} />}
      </div>
    </div>
  );
};

export default QuizApp;
