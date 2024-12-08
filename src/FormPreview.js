import React from "react";
import CategorizeQuestion from "./CategorizeQuestion";
import ClozeQuestion from "./ClozeQuestion";
import ComprehensionQuestion from "./ComprehensionQuestion";

const FormPreview = ({ questions }) => {
  return (
    <div className="form-preview">
      <h2>Preview Form</h2>
      {questions.map((question, index) => {
        switch (question.type) {
          case "Categorize":
            return <CategorizeQuestion key={index} />;
          case "Cloze":
            return <ClozeQuestion key={index} />;
          case "Comprehension":
            return <ComprehensionQuestion key={index} />;
          default:
            return null;
        }
      })}
    </div>
  );
};

export default FormPreview;
