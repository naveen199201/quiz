import React, { useState, useEffect } from "react";
import { FaPlusCircle } from "react-icons/fa";
import { PiCopy } from "react-icons/pi";
import { RiDeleteBinLine } from "react-icons/ri";
import "./ComprehensionQuestion.css";
import { FaRegImage } from "react-icons/fa6";
import { useDrag, useDrop, DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ComprehensionQuestion = ({
  questionIndex,
  onDelete,
  handleSave,
  questionData,
  onAdd,
  onDuplicate,
}) => {
  const [paragraph, setParagraph] = useState(questionData.paragraph || "");
  const [questions, setQuestions] = useState(questionData.questions || []);
  const [rows, setRows] = useState(2); 
  const [image, setImage] = useState(questionData.image || "");

  const addQuestion = () => {
    setQuestions([
      ...questions,
      {
        text: "",
        options: ["", "", "", ""],
        correctOption: null,
        image: "",
      },
    ]);
  };

  const updateQuestionText = (index, text) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index].text = text;
    setQuestions(updatedQuestions);
  };

  const updateOptionText = (qIndex, optionIndex, text) => {
    const updatedQuestions = [...questions];
    updatedQuestions[qIndex].options[optionIndex] = text;
    setQuestions(updatedQuestions);
  };

  const updateCorrectOption = (qIndex, optionIndex) => {
    const updatedQuestions = [...questions];
    updatedQuestions[qIndex].correctOption = optionIndex;
    setQuestions(updatedQuestions);
  };

  const deleteQuestion = async (index, mcqId) => {
    const deleteUrl = "https://backend-eight-virid-92.vercel.app/api/remove";
    const params = {
      type: "comprehension",
      id: questionData._id,
      mcq_id: mcqId,
    };
    try {
      const response = await axios.post(deleteUrl,{}, {params});
      if (response.status === 200) {
        toast.success(response.data.message);
      }
      const updatedQuestions = questions.filter((_, i) => i !== index);
      setQuestions(updatedQuestions);
    } catch (error) {
      console.error("Error deleting questions:", error);
    }
  };

  const duplicateQuestion = (index) => {
    const questionToDuplicate = questions[index];
    const duplicatedQuestion = {
      ...questionToDuplicate,
      id: questions.length + 1,
    };
    setQuestions([...questions, duplicatedQuestion]);
  };

  useEffect(() => {
    handleSave(
      questionIndex,
      {'_id':questionData._id ,
        paragraph,
        questions,
        image
      },
      "comprehension"
    );
  }, [paragraph, questions, image]);

  const handleFocus = () => {
    setRows(10);
  };

  const handleBlur = () => {
    setRows(2);
  };
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(URL.createObjectURL(file));
    }
  };
  const moveQuestion = (fromIndex, toIndex) => {
    const updatedQuestions = [...questions];
    const [movedQuestion] = updatedQuestions.splice(fromIndex, 1);
    updatedQuestions.splice(toIndex, 0, movedQuestion);
    setQuestions(updatedQuestions);
  };
  const DraggableQuestion = ({ question, qIndex }) => {
    const [, drag] = useDrag({
      type: "QUESTION",
      item: { index: qIndex },
    });

    const [, drop] = useDrop({
      accept: "QUESTION",
      hover: (draggedItem) => {
        if (draggedItem.index !== qIndex) {
          moveQuestion(draggedItem.index, qIndex);
          draggedItem.index = qIndex;
        }
      },
    });
    return (
      <div className="mcq-questions-container">
        <div
          ref={(node) => drag(drop(node))}
          key={`${questionIndex}-${question._id}-${qIndex}`}
          className="question-block"
        >
          <div className="question-header">
            <input
              type="text"
              placeholder="Enter question text"
              value={question.text}
              onChange={(e) => updateQuestionText(qIndex, e.target.value)}
              className="question-input"
            />
          </div>

          <div className="options-block">
            {question.options.map((option, oIndex) => (
              <div
                key={`${question._id}-${qIndex}-${oIndex}`}
                className="option-row"
              >
                <input
                  type="radio"
                  name={`correctOption-${questionIndex}-${qIndex}-${oIndex}`}
                  checked={question.correctOption === oIndex}
                  onChange={() => updateCorrectOption(qIndex, oIndex)}
                />
                <input
                  type="text"
                  placeholder={`Option ${oIndex + 1}`}
                  value={option}
                  onChange={(e) =>
                    updateOptionText(qIndex, oIndex, e.target.value)
                  }
                  className="option-input"
                />
              </div>
            ))}
          </div>
          {question.correctOption !== null && (
            <p className="answer-display">
              Answer: {question.options[question.correctOption]}
            </p>
          )}
        </div>
        <div className="action-buttons">
          <button className="add-question" onClick={() => addQuestion()}>
            <FaPlusCircle />
          </button>
          <button
            className="duplicate-question"
            onClick={() => duplicateQuestion(qIndex)}
          >
            <PiCopy />
          </button>
          <button
            className="delete-question"
            onClick={() => deleteQuestion(qIndex, question._id)}
          >
            <RiDeleteBinLine />
          </button>
        </div>
      </div>
    );
  };
  return (
    <div className="comprehension-question-container">
      <div className="comprehension-question">
        <h3>Comprehension Question</h3>
        <div style={{ display: "flex", alignItems: "center" }}>
          <textarea
            placeholder="Enter the paragraph here..."
            value={paragraph}
            onChange={(e) => setParagraph(e.target.value)}
            rows={rows}
            className="paragraph-input"
            onFocus={handleFocus}
            onBlur={handleBlur}
          />
          <label
            htmlFor={`${questionIndex}-comprehension-image-upload`}
            className="image-upload-label"
          >
            <FaRegImage
              style={{
                cursor: "pointer",
                marginLeft: "10px",
                fontSize: "24px",
              }}
            />
          </label>
          <input
            type="file"
            id={`${questionIndex}-comprehension-image-upload`}
            style={{ display: "none" }}
            accept="image/*"
            onChange={handleImageUpload}
          />
        </div>

        {image && (
          <div style={{ marginTop: "10px" }}>
            <img
              src={image}
              alt="Uploaded"
              style={{ maxWidth: "200px", display: "block" }}
            />
          </div>
        )}

        <h4>Questions</h4>
        <DndProvider backend={HTML5Backend}>
          {questions.map((question, qIndex) => (
            <DraggableQuestion
              key={`${questionData._id}-${qIndex}`}
              question={question}
              qIndex={qIndex}
            />
          ))}
        </DndProvider>
      </div>
      <div className="action-buttons">
        <button className="add-question" onClick={() => onAdd("cloze")}>
          <FaPlusCircle />
        </button>
        <button
          className="duplicate-question"
          onClick={() => {
            let newData = {
              paragraph,
              questions,
              image,
            };
            onDuplicate("cloze", newData, questionIndex + 1);
          }}
        >
          <PiCopy />
        </button>
        <button
          className="delete-question"
          onClick={() => onDelete("comprehension", questionIndex, questionData._id)}
        >
          <RiDeleteBinLine />
        </button>
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

export default ComprehensionQuestion;
