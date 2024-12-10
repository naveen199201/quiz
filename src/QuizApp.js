import React, { useState, useEffect } from "react";
import FormEditor from "./FormEditor";
import QuizForm from "./QuizForm";
import axios from "axios";
import "./QuizApp.css"

const QuizApp = () => {
  const baseUrl = "https://backend-eight-virid-92.vercel.app/api/questions";
  const [questions, setQuestions] = useState({});
  const [activeTab, setActiveTab] = useState("formEditor");

  useEffect(() => {
    const fetchQuestions = async () => {
      const params = { quiz: true };
      try {
        const response = await axios.get(baseUrl, {params});
        console.log(response.data);
        setQuestions(response.data);
      } catch (error) {
        console.error("Error fetching questions:", error);
      }
    };

    fetchQuestions();
  }, [activeTab]); 

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
          <FormEditor />
        )}
        {activeTab === "quiz" && <QuizForm questions={questions} />}
      </div>
    </div>
  );
};

export default QuizApp;
