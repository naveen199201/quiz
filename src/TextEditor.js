import React from "react";
import { EditorContent } from "@tiptap/react";

const TextEditor = ({ editor, toggleUnderline }) => {
  if (!editor) return null;

  return (
    <div>
      <div style={{ marginBottom: "10px" }}>
        <button onClick={toggleUnderline}>Underline</button>
      </div>
      <EditorContent editor={editor} />
    </div>
  );
};

export default TextEditor;
