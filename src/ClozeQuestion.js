import React, { useState, useEffect, useRef } from "react";
import ReactQuill from "react-quill";
import { useDrag, useDrop } from "react-dnd";
import { FaPlusCircle } from "react-icons/fa";
import { PiCopy } from "react-icons/pi";
import { RiDeleteBinLine } from "react-icons/ri";
import { FaRegImage } from "react-icons/fa6";
import "quill/dist/quill.snow.css";
import "./ClozeQuestion.css";

// Draggable Option Component
const DraggableOption = ({ word, index, moveOption, deleteOption }) => {
  const [, drag] = useDrag({
    type: "OPTION",
    item: { index },
  });

  const [, drop] = useDrop({
    accept: "OPTION",
    hover: (draggedItem) => {
      if (draggedItem.index !== index) {
        moveOption(draggedItem.index, index);
        draggedItem.index = index;
      }
    },
  });

  return (
    <>
      <div ref={(node) => drag(drop(node))}>
        <div key={index} style={{ display: "flex", alignItems: "center" }}>
          <input type="checkbox" disabled checked />
          <span className="cloze-option">{word}</span>
          <button
            className="delete-question"
            onClick={() => deleteOption(word)}
          >
            x
          </button>
        </div>
      </div>
    </>
  );
};

const ClozeQuestion = ({
  questionIndex,
  onDelete,
  handleSave,
  questionData,
  onAdd,
  onDuplicate,
}) => {
  const [answerText, setAnswerText] = useState(questionData.answerText || "");
  const [underlinedWords, setUnderlinedWords] = useState(
    questionData.underlinedWords || []
  );
  const [questionText, setQuestionText] = useState(
    questionData.questionText || ""
  );
  const [image, setImage] = useState(questionData.image || "");
  const quillRef = useRef(null);

  useEffect(() => {
    handleSave(
      questionIndex,
      {
        questionText,
        underlinedWords,
        answerText,
        image,
      },
      "cloze"
    );
  }, [underlinedWords, answerText, questionText, image]);

  const extractUnderlinedWords = () => {
    const editor = quillRef.current.getEditor();
    const contents = editor.getContents();
    const words = [];
    contents.ops.forEach((op) => {
      if (op.attributes?.underline) {
        words.push(op.insert.trim());
      }
    });
    setUnderlinedWords(words);
  };

  const renderBlanks = () => {
    const editor = quillRef.current.getEditor();
    const contents = editor.getContents();
    return contents.ops
      .map((op) => {
        if (op.attributes?.underline) {
          return "____ ";
        }
        return op.insert;
      })
      .join("");
  };

  const handleEditorChange = (value) => {
    setAnswerText(value);
    extractUnderlinedWords(value);
    setQuestionText(renderBlanks());
  };

  // Move option (drag and drop)
  const moveOption = (fromIndex, toIndex) => {
    const updatedWords = [...underlinedWords];
    const [movedWord] = updatedWords.splice(fromIndex, 1);
    updatedWords.splice(toIndex, 0, movedWord);
    setUnderlinedWords(updatedWords);
  };

  const deleteOption = (word) => {
    setUnderlinedWords((prevWords) => prevWords.filter((w) => w !== word));
    const editor = quillRef.current.getEditor();
    const plainText = editor.getText();
    const wordIndex = plainText.indexOf(word);
    editor.formatText(wordIndex, word.length, "underline", false);
    const updatedContents = editor.getContents();
    setAnswerText(updatedContents);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(URL.createObjectURL(file));
    }
  };

  return (
    <div className="cloze-question-container">
      <div className="cloze-question">
        <h3>Cloze Question</h3>

        <div className="cloze-question-section">
          <h4>Question</h4>
          <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
            <div className="input-group">
              <label htmlFor="Preview" className="input-label">
                Preview <span className="required-star">*</span>
              </label>
              <input
                type="text"
                value={questionText}
                readOnly
                className="preview-textbox"
                placeholder="Preview"
              />
            </div>

            <label
              htmlFor={`${questionIndex}-cloze-image-upload`}
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
              id={`${questionIndex}-cloze-image-upload`}
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

          <div className="input-group">
            <label htmlFor="Sentence" className="input-label">
              Sentence <span className="required-star">*</span>
            </label>
            <ReactQuill
              ref={quillRef}
              theme="snow"
              value={answerText}
              onChange={handleEditorChange}
              modules={{
                toolbar: [
                  ["underline"], // Only allow basic formatting
                ],
              }}
              style={{ height: "150px", marginBottom: "10px" }}
            />
          </div>
          {/* Options Section */}
          {underlinedWords.length > 0 ? (
            <div className="options-section">
              <h4>Options</h4>
              {underlinedWords.map((word, index) => (
                <div
                  key={index}
                  style={{ display: "flex", alignItems: "center" }}
                >
                  <DraggableOption
                    word={word}
                    index={index}
                    moveOption={moveOption}
                    deleteOption={deleteOption}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div></div>
          )}
        </div>
      </div>
      <div className="action-buttons">
        <button className="add-question" onClick={() => onAdd("cloze")}>
          <FaPlusCircle />
        </button>
        <button
          className="duplicate-question"
          onClick={() => {
            let newData = {
              questionText,
              underlinedWords,
              answerText,
              image,
              rawText: editorText,
            };
            onDuplicate("cloze", newData, questionIndex + 1);
          }}
        >
          <PiCopy />
        </button>
        <button
          className="delete-question"
          onClick={() => onDelete("cloze", questionIndex, questionData._id)}
        >
          <RiDeleteBinLine />
        </button>
      </div>
    </div>
  );
};

export default ClozeQuestion;
