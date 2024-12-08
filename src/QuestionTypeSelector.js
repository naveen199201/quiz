import React from "react";

const QuestionTypeSelector = ({ onAddQuestion }) => {
  return (
    <div className="question-type-selector">
      <button onClick={() => onAddQuestion("categorize")}>
        Add Categorize Question
      </button>
      <button onClick={() => onAddQuestion("cloze")}>Add Cloze Question</button>
      <button onClick={() => onAddQuestion("comprehension")}>
        Add Comprehension Question
      </button>
    </div>
  );
};

export default QuestionTypeSelector;
