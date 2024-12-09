import React, { useState, useEffect } from "react";
import {
  Editor,
  EditorState,
  RichUtils,
  convertToRaw,
  ContentState,
} from "draft-js";
import { useDrag, useDrop, DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { FaPlusCircle } from "react-icons/fa";
import { PiCopy } from "react-icons/pi";
import { RiDeleteBinLine } from "react-icons/ri";
import { FaRegImage } from "react-icons/fa6";

import "draft-js/dist/Draft.css";
import "./ClozeQuestion.css";

const TextEditor = ({ editorState, setEditorState, toggleUnderline }) => (
  <div className="text-editor">
    <div className="toolbar">
      <button onClick={toggleUnderline}>U</button>
    </div>
    <div className="editor-container">
      <Editor
        editorState={editorState}
        onChange={setEditorState}
        placeholder="Underline the words here to convert them into blanks..."
      />
    </div>
  </div>
);

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
      <div ref={(node) => drag(drop(node))} className="option">
        {word}
      </div>
      <button className="delete-option" onClick={() => deleteOption(index)}>
        x
      </button>
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
  // const [editorState, setEditorState] = useState(() => {
  //   // Check if questionData.answerText exists, and initialize accordingly
  //   const contentState = questionData?.answerText
  //     ? ContentState.createFromText(questionData.answerText) // If there's answerText, initialize with it
  //     : ContentState.createFromText(""); // If no answerText, initialize with empty text
  //   return EditorState.createWithContent(contentState);
  // });
  console.log(questionData.rawText);
  const contentState = questionData?.rawText && Array.isArray(questionData.rawText)
  ? ContentState.createFromBlockArray(questionData.rawText)
  : ContentState.createFromText("");
  console.log(contentState);
  EditorState.createWithContent(contentState);
  // editorState.createWithContent(contentState);
  // const contentState = questionData?.rawText
  //   ? ContentState.createFromBlockArray(questionData.rawText[0])
  //   : ContentState.createFromText("");
  const [editorState, setEditorState] = useState(
    EditorState.createWithContent(contentState)
  );

  const [underlinedWords, setUnderlinedWords] = useState(
    questionData.underlinedWords || []
  );
  const [questionText, setQuestionText] = useState(
    questionData.questionText || ""
  );
  const [answerText, setAnswerText] = useState(questionData.answerText || "");
  const [image, setImage] = useState(questionData.image || "");
  const [rawText, setRawText] = useState(questionData.rawText || []);

  useEffect(() => {
    handleSave(
      questionIndex,
      {
        questionText,
        underlinedWords,
        answerText,
        image,
        rawText,
      },
      "cloze"
    );
  }, [underlinedWords, answerText, questionText, image, rawText]);

  // Function to apply underline
  const toggleUnderline = () => {
    const newEditorState = RichUtils.toggleInlineStyle(
      editorState,
      "UNDERLINE"
    );
    setEditorState(newEditorState);
    extractUnderlinedWords(newEditorState);
  };

  // Extract underlined words and update preview text
  const extractUnderlinedWords = (newEditorState) => {
    const contentState = newEditorState.getCurrentContent();
    const rawContent = convertToRaw(contentState);
    const newUnderlinedWords = [];
    let updatedPreviewText = rawContent.blocks
      .map((block) => {
        let currentIndex = 0;
        let blockPreview = "";

        block.inlineStyleRanges.forEach((styleRange) => {
          if (styleRange.style === "UNDERLINE") {
            if (styleRange.offset > currentIndex) {
              blockPreview += block.text.substring(
                currentIndex,
                styleRange.offset
              );
            }

            blockPreview += " ______ ";
            const word = block.text.substring(
              styleRange.offset,
              styleRange.offset + styleRange.length
            );
            newUnderlinedWords.push(word);

            currentIndex = styleRange.offset + styleRange.length;
          }
        });

        if (currentIndex < block.text.length) {
          blockPreview += block.text.substring(currentIndex);
        }

        return blockPreview;
      })
      .join("\n");

    setUnderlinedWords(Array.from(new Set(newUnderlinedWords)));
    setQuestionText(updatedPreviewText);
    setAnswerText(contentState.getPlainText());
    setRawText(rawContent.blocks);
  };

  // Update editor state and preview text dynamically
  // const handleEditorChange = (newEditorState) => {
  //   setEditorState(newEditorState);
  //   const contentState = newEditorState.getCurrentContent();
  //   const plainText = contentState.getPlainText();
  //   setQuestionText(plainText); // Update preview text with plain text
  //   extractUnderlinedWords(newEditorState); // Update underlined words
  // };

  const handleEditorChange = (newEditorState) => {
    setEditorState(newEditorState);

    // Extract the raw content from the editor state
    const contentState = newEditorState.getCurrentContent();
    const plainText = contentState.getPlainText();
    const rawContent = convertToRaw(contentState); // Get raw content
    console.log(rawContent);

    // Now, you can save raw content
    setQuestionText(plainText); // Save raw content (or you can store it wherever necessary)
    setRawText(rawContent.blocks);
    // If you want to keep track of underlined words or any other info:
    extractUnderlinedWords(newEditorState); // Update underlined words if necessary
  };

  // Move option (drag and drop)
  const moveOption = (fromIndex, toIndex) => {
    const updatedWords = [...underlinedWords];
    const [movedWord] = updatedWords.splice(fromIndex, 1);
    updatedWords.splice(toIndex, 0, movedWord);
    setUnderlinedWords(updatedWords);
  };

  // Delete an option
  const deleteOption = (index) => {
    const updatedWords = underlinedWords.filter((_, i) => i !== index);
    setUnderlinedWords(updatedWords);
  };
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(URL.createObjectURL(file)); // Display the image locally
    }
  };
  return (
    <div className="cloze-question-container">
      <div className="cloze-question">
        <h3>Cloze Question</h3>
        {/* Question Input Box */}

        <div className="cloze-question-section">
          <h4>Question</h4>
          <div style={{ display: "flex", alignItems: "center" }}>
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
            {/* Image Upload Icon */}

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
              style={{ display: "none" }} // Hide the file input
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
            <TextEditor
              editorState={editorState}
              setEditorState={handleEditorChange}
              toggleUnderline={toggleUnderline}
              multiLine={false}
            />
          </div>

          {/* Options Section */}
          <DndProvider backend={HTML5Backend}>
            <div className="options-section">
              <h4>Options</h4>
              {underlinedWords.length > 0 ? (
                underlinedWords.map((word, index) => (
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <DraggableOption
                      key={`${questionData._id}-${questionIndex}-${index}`}
                      word={word}
                      index={index}
                      moveOption={moveOption}
                      deleteOption={deleteOption}
                    />
                  </div>
                ))
              ) : (
                <p>No options yet. Underline text to create options.</p>
              )}
            </div>
          </DndProvider>
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
              rawText,
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
