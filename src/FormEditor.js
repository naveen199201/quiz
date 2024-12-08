import React, {useEffect, useState } from "react";
import QuestionTypeSelector from "./QuestionTypeSelector";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import CategorizeQuestion from "./CategorizeQuestion";
import ClozeQuestion from "./ClozeQuestion";
import ComprehensionQuestion from "./ComprehensionQuestion";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";

const baseUrl = "https://backend-eight-virid-92.vercel.app/api/questions";
// const baseUrl = "http://localhost:5000/api/questions";
const FormEditor = () => {
  const [questions, setQuestions]= useState({});
  const [clozeQuestions, setClozeQuestions] = useState([]);
  const [categorizeQuestions, setCategorizeQuestions] = useState([]);
  const [comprehensionQuestions, setComprehensionQuestions] = useState([]);

  useEffect(() => {
    const fetchQuestions = async () => {
      const params = { quiz: false };
      try {
        const response = await axios.get(baseUrl, params);
        console.log(response.data);
        setQuestions(response.data);
        setClozeQuestions(response.data?.clozeQuestions);
        setCategorizeQuestions(response.data?.categorizeQuestions);
        setComprehensionQuestions(response.data?.comprehensionQuestions);
      } catch (error) {
        console.error("Error fetching questions:", error);
      }
    };

    fetchQuestions();
  }, []);

  const addQuestion = (type) => {
    switch (type) {
      case "cloze": {
        const updatedQuestions = [
          ...clozeQuestions,
          { questionText: "", underlinedWords: [], answerText: "",  image:'','_id':uuidv4() },
        ];
        setClozeQuestions(updatedQuestions);
        break;
      }
      case "categorize": {
        const updatedQuestions = [
          ...categorizeQuestions,
          { categories: [], items: [] , description:'', image:'','_id':uuidv4() },
        ];
        setCategorizeQuestions(updatedQuestions);
        break;
      }
      case "comprehension": {
        const updatedQuestions = [
          ...comprehensionQuestions,
          { paragraph: "", questions: [], image:'', '_id':uuidv4() },
        ];
        setComprehensionQuestions(updatedQuestions);
        break;
      }
      default: {
        console.error("Unknown question type:", type);
        break;
      }
    }
  };
  const handleDeleteQuestion = (type, index) => {
    switch (type) {
      case "cloze": {
        const updatedQuestions = clozeQuestions.filter((_, i) => i !== index);
        setClozeQuestions(updatedQuestions);
        break;
      }
      case "categorize": {
        const updatedQuestions = categorizeQuestions.filter(
          (_, i) => i !== index
        );
        setCategorizeQuestions(updatedQuestions);
        break;
      }
      case "comprehension": {
        const updatedQuestions = comprehensionQuestions.filter(
          (_, i) => i !== index
        );
        setComprehensionQuestions(updatedQuestions);
        break;
      }
      default: {
        console.error("Unknown question type:", type);
        break;
      }
    }
  };
  const handleSubmitQuestions = () => {
    let postData = {
      clozeQuestions,
      categorizeQuestions,
      comprehensionQuestions,
    };
    console.log(postData);
    axios.post(baseUrl, postData);
  };

  const handleSaveQuestion = (index, questionData, type) => {
    switch (type) {
      case "cloze": {
        let updatedQuestions = [...clozeQuestions];
        updatedQuestions[index] = questionData;
        setClozeQuestions(updatedQuestions);
        break;
      }
      case "categorize": {
        let updatedQuestions = [...categorizeQuestions];
        updatedQuestions[index] = questionData;
        setCategorizeQuestions(updatedQuestions);
        break;
      }
      case "comprehension": {
        let updatedQuestions = [...comprehensionQuestions];
        updatedQuestions[index] = questionData;
        setComprehensionQuestions(updatedQuestions);
        break;
      }
      default: {
        console.error("Unknown question type:", type);
        break;
      }
    }
  };

  return (
    <div className="form-editor">
      {/* <FormHeader /> */}
      <QuestionTypeSelector onAddQuestion={addQuestion} />
      <DndProvider backend={HTML5Backend}>
        {categorizeQuestions?.length > 0 &&
          categorizeQuestions.map((question, index) => {
            return (
              <CategorizeQuestion
                key={index}
                questionIndex={index}
                questionData={question}
                handleSave={handleSaveQuestion}
                onDelete={() => handleDeleteQuestion(index, "categorize")}
              />
            );
          })}
        {clozeQuestions?.length > 0 &&
          clozeQuestions.map((question, index) => {
            return (
              <ClozeQuestion
                key={index}
                questionIndex={index}
                questionData={question}
                handleSave={handleSaveQuestion}
                onDelete={() => handleDeleteQuestion(index, "cloze")}
              />
            );
          })}
        {comprehensionQuestions?.length > 0 &&
          comprehensionQuestions.map((question, index) => {
            return (
              <ComprehensionQuestion
                key={index}
                questionIndex={index}
                questionData={question}
                handleSave={handleSaveQuestion}
                onDelete={() => handleDeleteQuestion(index, "comprehension")}
              />
            );
          })}
      </DndProvider>
      {/* <FormPreview questions={questions} /> */}
      <button onClick={handleSubmitQuestions}>Submit</button>
    </div>
  );
};

export default FormEditor;
