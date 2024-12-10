import React, { useEffect, useState } from "react";
import QuestionTypeSelector from "./QuestionTypeSelector";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import CategorizeQuestion from "./CategorizeQuestion";
import ClozeQuestion from "./ClozeQuestion";
import ComprehensionQuestion from "./ComprehensionQuestion";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const baseUrl = "https://backend-eight-virid-92.vercel.app/api/questions";
const FormEditor = () => {
  const [clozeQuestions, setClozeQuestions] = useState([]);
  const [categorizeQuestions, setCategorizeQuestions] = useState([]);
  const [comprehensionQuestions, setComprehensionQuestions] = useState([]);

  useEffect(() => {
    const fetchQuestions = async () => {
      const params = { quiz: false };
      try {
        const response = await axios.get(baseUrl, { params });
        console.log(response.data);
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
    const deleteUrl = "https://backend-eight-virid-92.vercel.app/api/remove";

    const queryParams = { type, id };
    try {
      const response = await axios.post(deleteUrl, {}, { params: queryParams });
      console.log(response.data);
      if (response.status === 200) {
        toast.success(response.data.message);
      }
      return true;
    } catch (error) {
      console.error("Error deleting questions:", error);
      toast.error(error);
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
          ...clozeQuestions.slice(index + 1),
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
        console.log("updated", updatedQuestions);
        setCategorizeQuestions(updatedQuestions);
        break;
      }
      case "comprehension": {
        const updatedQuestions = [
          ...comprehensionQuestions.slice(0, 1),
          data,
          ...comprehensionQuestions.slice(1),
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
  const handleSubmitQuestions = async () => {
    let postData = {
      clozeQuestions,
      categorizeQuestions,
      comprehensionQuestions,
    };
    console.log(postData);
    const res = await axios.post(baseUrl, postData);
    if (res.status === 200) {
      toast.success(res.data.message, {
        position: "top-center", // Change to "top-center" for top middle or "bottom-center" for bottom middle
      });
    } else {
    }
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
            <ClozeQuestion
              key={index}
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
      {(clozeQuestions.length>0 ||
        categorizeQuestions.length>0  ||
        comprehensionQuestions.length>0 ) && (
          <button className="submit-button" onClick={handleSubmitQuestions}>
            Submit
          </button>
        )}
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

export default FormEditor;
