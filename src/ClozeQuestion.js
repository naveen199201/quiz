import React, { useState, useEffect } from "react";
import { Editor, EditorState, RichUtils, convertToRaw, ContentState } from "draft-js";
import { useDrag, useDrop, DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { IoMdAddCircle } from "react-icons/io";
import { HiOutlineDuplicate } from "react-icons/hi";
import { RiDeleteBinLine } from "react-icons/ri";
import { FaRegImage } from "react-icons/fa6";
import axios from "axios";


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
    <div ref={(node) => drag(drop(node))} className="option">
      {word}
      <button className="delete-option" onClick={() => deleteOption(index)}>
        x
      </button>
    </div>
  );
};

const ClozeQuestion = ({
  questionIndex,
  onDelete,
  handleSave,
  questionData,
}) => {
  const [editorState, setEditorState] = useState(() => {
    
    // Check if questionData.answerText exists, and initialize accordingly
    const contentState = questionData?.answerText
      ? ContentState.createFromText(questionData.answerText) // If there's answerText, initialize with it
      : ContentState.createFromText(""); // If no answerText, initialize with empty text
    return EditorState.createWithContent(contentState);
  });
  const [image, setImage] = useState(questionData.image || "");
  const [underlinedWords, setUnderlinedWords] = useState(
    questionData.underlinedWords || []
  );
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    console.log('file')
    if (file) {
      console.log('file name')
      const formData = new FormData();
      formData.append("image", file);
  
      try {
        const response = await axios.post("http://localhost:5000/imageupload", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
  
        const { imageId } = response.data; // MongoDB ID of the image
        const imageUrl = `http://localhost:5000/api/uploads/${imageId}`;
        setImage(imageUrl); // Set the image URL for display
      } catch (error) {
        console.error("Error uploading the image", error);
      }
    }
  };
  const [questionText, setQuestionText] = useState(
    questionData.questionText || ""
  );
  const [answerText, setAnswerText] = useState(questionData.answerText || "");

  useEffect(() => {
    // Initialize local state when props change
    
    handleSave(questionIndex, {
      questionText,
      underlinedWords,
      answerText,
      image,
    },"cloze")
  }, [underlinedWords, answerText]);

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
  };

  // Update editor state and preview text dynamically
  const handleEditorChange = (newEditorState) => {
    setEditorState(newEditorState);
    const contentState = newEditorState.getCurrentContent();
    const plainText = contentState.getPlainText();
    setQuestionText(plainText); // Update preview text with plain text
    extractUnderlinedWords(newEditorState); // Update underlined words
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

  return (
    <div className="cloze-question-container">
      <div className="cloze-question">
        <h3>Cloze Question</h3>

        {/* Question Input Box */}


        <div className="question-section">
          <h4>Question</h4>
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
          <label htmlFor={`q${questionIndex}`} className="image-upload-label">
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
                id={`q${questionIndex}`}
                style={{ display: "none" }} // Hide the file input
                accept="image/*"
                onChange={handleImageUpload}
              />

              {/* Display the uploaded image */}
              {image && (
                <img
                  src={image}
                  alt="Uploaded"
                  style={{ marginTop: "10px", maxWidth: "200px" }}
                />
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
                  <DraggableOption
                    key={index}
                    word={word}
                    index={index}
                    moveOption={moveOption}
                    deleteOption={deleteOption}
                  />
                ))
              ) : (
                <p>No options yet. Underline text to create options.</p>
              )}
            </div>
          </DndProvider>
        </div>
      </div>
      <div className="action-buttons">
        <button className="add-question" onClick={onDelete}>
          <IoMdAddCircle />
        </button>
        <button className="duplicate-question" onClick={onDelete}>
          <HiOutlineDuplicate />
        </button>
        <button className="delete-question" onClick={onDelete}>
          <RiDeleteBinLine />
        </button>
      </div>
    </div>
  );
};

export default ClozeQuestion;
