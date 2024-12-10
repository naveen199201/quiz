import React, { useState } from "react";
import './formheader.css';

const FormHeader = () => {
  const [headerImage, setHeaderImage] = useState(null);
  const [formTitle, setFormTitle] = useState("Untitled Quiz");

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setHeaderImage(URL.createObjectURL(file));
    }
  };

  return (
    <div className="form-header">
      <input
        type="text"
        placeholder="Enter form title"
        value={formTitle}
        onChange={(e) => setFormTitle(e.target.value)}
      ></input>
      <div className="form-options">
        <button>Save</button>
      {/* <input type="file" onChange={handleImageChange} />
      {headerImage && <img src={headerImage} alt="Header" />} */}
      
      </div>
      
    </div>
  );
};

export default FormHeader;
