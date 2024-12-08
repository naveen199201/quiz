import React, { useEffect, useState } from "react";
import QuestionTypeSelector from "./QuestionTypeSelector";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import CategorizeQuestion from "./CategorizeQuestion";
import ClozeQuestion from "./ClozeQuestion";
import ComprehensionQuestion from "./ComprehensionQuestion";
import { FaPlusCircle } from "react-icons/fa";
import { PiCopy } from "react-icons/pi";
import { RiDeleteBinLine } from "react-icons/ri";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";

// const baseUrl = "https://backend-eight-virid-92.vercel.app/api/questions";
const baseUrl = "http://localhost:5000/api/questions";
const FormEditor = () => {
  // const [questions, setQuestions] = useState({});
  const [clozeQuestions, setClozeQuestions] = useState([]);
  const [categorizeQuestions, setCategorizeQuestions] = useState([]);
  const [comprehensionQuestions, setComprehensionQuestions] = useState([]);

  useEffect(() => {
    const fetchQuestions = async () => {
      const params = { quiz: false };
      try {
        const response = await axios.get(baseUrl, params);
        console.log(response.data);
        // setQuestions(response.data);
        setClozeQuestions(response?.data.clozeQuestions);
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
          {
            rawText: [],
            questionText: "",
            underlinedWords: [],
            answerText: "",
            _id: uuidv4(),
          },
        ];
        setClozeQuestions(updatedQuestions);
        break;
      }
      case "categorize": {
        const updatedQuestions = [
          ...categorizeQuestions,
          { categories: [], items: [], _id: uuidv4() },
        ];
        setCategorizeQuestions(updatedQuestions);
        break;
      }
      case "comprehension": {
        const updatedQuestions = [
          ...comprehensionQuestions,
          { paragraph: "", questions: [], _id: uuidv4() },
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
  const deleteQuestion = async (type, id) => {
    const deleteUrl = "http://localhost:5000/api/remove";

    const queryParams = { type, id };
    try {
      const response = await axios.post(deleteUrl,{}, {params:queryParams});
      console.log(response.data);
      // setQuestions(response.data);
      return true;
    } catch (error) {
      console.error("Error fetching questions:", error);
    }
    return false;
  };

  const handleDeleteQuestion = async (type, index, id) => {
    console.log(index);
    const deleted = await deleteQuestion(type, id);
    if (deleted) {
      switch (type) {
        case "cloze": {
          const updatedQuestions = clozeQuestions.filter((_, i) => i !== index);
          setClozeQuestions(updatedQuestions);
          break;
        }
        case "categorize": {
          console.log(categorizeQuestions);
          const updatedQuestions = categorizeQuestions.filter(
            (_, i) => i !== index
          );
          console.log(categorizeQuestions);

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
    } else {
      console.log("unable to delete the question");
    }
  };
  const duplicateQuestion = (type, data, index) => {
    data._id = uuidv4();
    console.log(data);
    switch (type) {
      case "cloze": {
        const updatedQuestions = [
          ...clozeQuestions.slice(0, index),
          data,
          ...clozeQuestions.slice(index+1),
        ];
        setClozeQuestions(updatedQuestions);
        break;
      }
      case "categorize": {
        const updatedQuestions = [
          ...categorizeQuestions.slice(0, index),
          data,
          ...categorizeQuestions.slice(index),
        ];
        console.log('updated',updatedQuestions);
        setCategorizeQuestions(updatedQuestions);
        break;
      }
      case "comprehension": {
        const updatedQuestions = [
          ...comprehensionQuestions.slice(0, 1),
          data,
          ...comprehensionQuestions.slice(1),
        ];
        // const updatedQuestions = comprehensionQuestions.splice(index, 0, data);

        // const updatedQuestions = [...comprehensionQuestions, data];
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
        {categorizeQuestions.map((question, index) => {
          return (
            <CategorizeQuestion
              key={index}
              // key={`category-${question._id}`}
              questionIndex={index}
              questionData={question}
              handleSave={handleSaveQuestion}
              onDelete={handleDeleteQuestion}
              onAdd={addQuestion}
              onDuplicate={duplicateQuestion}
            />
          );
        })}
        {clozeQuestions.map((question, index) => {
          return (
            // <div
            //   key={`cloze-${question._id}`}
            //   className="cloze-question-container"
            // >
            <ClozeQuestion
              key={index}
              // key={`cloze-${question._id}`}
              questionIndex={index}
              questionData={question}
              handleSave={handleSaveQuestion}
              onDelete={handleDeleteQuestion}
              onAdd={addQuestion}
              onDuplicate={duplicateQuestion}
            />
          );
        })}
        {comprehensionQuestions.map((question, index) => {
          return (
            <ComprehensionQuestion
              key={index}
              // key={`comprehension-${question._id}`}
              questionIndex={index}
              questionData={question}
              handleSave={handleSaveQuestion}
              onDelete={handleDeleteQuestion}
              onAdd={addQuestion}
              onDuplicate={duplicateQuestion}
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
