import React from "react";
import { useDrag, useDrop } from "react-dnd";

const DraggableOption = ({ word, index, moveOption, deleteOption }) => {
  const [, drag] = useDrag({
    type: "OPTION",
    item: { index },
  });

  const [, drop] = useDrop({
    accept: "OPTION",
    hover: (item) => {
      if (item.index !== index) {
        moveOption(item.index, index);
        item.index = index;
      }
    },
  });

  return (
    <div ref={(node) => drag(drop(node))} style={{ marginBottom: "5px" }}>
      {word}
      <button onClick={() => deleteOption(index)} style={{ marginLeft: "10px" }}>
        Delete
      </button>
    </div>
  );
};

export default DraggableOption;
