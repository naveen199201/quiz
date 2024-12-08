import React, { useState } from "react";
import QuizForm from "./QuizForm";
import './formheader.css';

const FormHeader = () => {
  const [headerImage, setHeaderImage] = useState(null);
  const [formTitle, setFormTitle] = useState("Untitled Quiz");

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setHeaderImage(URL.createObjectURL(file));
    }
  };
  const questions = {
    clozeQuestions: [
      {
        questionText: "What is the color of the sky?",
        underlinedWords: ["blue", "sky"],
        answerText: "The sky is blue.",
      },
      {
        questionText: "What is 2 + 2?",
        underlinedWords: ["2", "2"],
        answerText: "4",
      },
    ],
    categorizeQuestions: [
      {
        questionText: "Categorize the items.",
        categories: ["Fruits", "Animals"],
        items: [
          { category: "Fruits", answer: "Apple" },
          { category: "Animals", answer: "Dog" },
        ],
      },
    ],
    comprehensionQuestions: [
      {
        paragraph: "The fox jumped over the fence.",
        questions: [
          {
            text: "What did the fox jump over?",
            options: ["Wall", "Fence", "Tree"],
            correctOption: 1,
          },
          {
            text: "What animal is mentioned?",
            options: ["Fox", "Dog", "Cat"],
            correctOption: 0,
          },
        ],
      },
    ],
  };

  return (
    <div className="form-header">
      <input
        type="text"
        placeholder="Enter form title"
        value={formTitle}
        onChange={(e) => setFormTitle(e.target.value)}
      ></input>
      <div className="form-options">
        <button>Save</button>
      {/* <input type="file" onChange={handleImageChange} />
      {headerImage && <img src={headerImage} alt="Header" />} */}
      
      </div>
      
    </div>
  );
};

export default FormHeader;
