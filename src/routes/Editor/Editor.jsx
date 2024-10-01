import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import BaseLayout from "../../layouts/BaseLayout/BaseLayout";
import DraggableBlock from "../../components/DraggableBlock/DraggableBlock"; // Ensure you import the DraggableBlock
import "./Editor.css"; // Optional for custom styling

export default function Editor() {
  const { id } = useParams();
  const [doc, setDoc] = useState(null);
  const [blocks, setBlocks] = useState([]);
  const [activeEditor, setActiveEditor] = useState(null); // Track active editor
  const [isBoldActive, setIsBoldActive] = useState(false);
  const [isItalicActive, setIsItalicActive] = useState(false);
  const [isUnderlineActive, setIsUnderlineActive] = useState(false);
  const [isStrikeActive, setIsStrikeActive] = useState(false);

  useEffect(() => {
    // Load document from localStorage
    const storedDocuments = JSON.parse(localStorage.getItem("documents")) || [];
    const docData = storedDocuments.find((doc) => doc.id === parseInt(id));
    if (docData) {
      setDoc(docData);
      setBlocks(docData.content); // Assuming content is an array of blocks
    }
  }, [id]);

  // Move block to rearrange them
  const moveBlock = (fromIndex, toIndex) => {
    const updatedBlocks = [...blocks];
    const [movedBlock] = updatedBlocks.splice(fromIndex, 1);
    updatedBlocks.splice(toIndex, 0, movedBlock);
    setBlocks(updatedBlocks);
  };

  // Function to create a new block
  const addNewBlock = () => {
    const newBlock = {
      id: `${blocks.length || 0}`, // Assign ID based on the current number of blocks
      content: "",
    };
    const updatedBlocks = [...blocks, newBlock]; // Add the new block to the existing blocks
    setBlocks(updatedBlocks);

    // Update localStorage
    const storedDocuments = JSON.parse(localStorage.getItem("documents")) || [];
    const updatedDocuments = storedDocuments.map((document) => {
      if (document.id === parseInt(id)) {
        return { ...document, content: updatedBlocks }; // Update the current document
      }
      return document;
    });
    localStorage.setItem("documents", JSON.stringify(updatedDocuments));
  };

  // Function to update block content
  const updateBlockContent = (index, newContent) => {
    const updatedBlocks = [...blocks];
    updatedBlocks[index].content = newContent; // Update the specific block's content
    setBlocks(updatedBlocks);

    // Update localStorage
    const storedDocuments = JSON.parse(localStorage.getItem("documents")) || [];
    const updatedDocuments = storedDocuments.map((document) => {
      if (document.id === parseInt(id)) {
        return { ...document, content: updatedBlocks }; // Update the current document
      }
      return document;
    });
    localStorage.setItem("documents", JSON.stringify(updatedDocuments));
  };

  const saveDocument = () => {
    // Remove blocks with no content
    const nonEmptyBlocks = blocks.filter(
      (block) => block.content.trim() !== ""
    );

    // Update localStorage with the filtered blocks
    const storedDocuments = JSON.parse(localStorage.getItem("documents")) || [];
    const updatedDocuments = storedDocuments.map((document) => {
      if (document.id === parseInt(id)) {
        return { ...document, content: nonEmptyBlocks };
      }
      return document;
    });

    localStorage.setItem("documents", JSON.stringify(updatedDocuments));

    // Update the state with the non-empty blocks
    setBlocks(nonEmptyBlocks);

    console.log("Document saved:", nonEmptyBlocks);
  };

  const onSelectionUpdate = (editor) => {
    if (!editor) return;

    setIsBoldActive(editor.isActive("bold"));
    setIsItalicActive(editor.isActive("italic"));
    setIsUnderlineActive(editor.isActive("underline"));
    setIsStrikeActive(editor.isActive("strike"));
  };

  if (!doc) {
    return <div>Loading...</div>;
  }

  return (
    <BaseLayout>
      <h1 className="col-span-full text-3xl font-bold font-mono">
        {doc.title}
      </h1>

      {/* Global Toolbar */}
      <div className="flex flex-row gap-2 w-fit h-fit rounded border border-black p-2">
        <button
          onClick={() => {
            if (activeEditor) {
              activeEditor.chain().focus().toggleBold().run();
              setIsBoldActive(activeEditor.isActive("bold")); // Update state immediately
            }
          }}
          className={`px-2 py-1 rounded ${
            isBoldActive ? "bg-blue-500 text-white" : "bg-gray-100"
          }`}
        >
          Bold
        </button>
        <button
          onClick={() => {
            if (activeEditor) {
              activeEditor.chain().focus().toggleItalic().run();
              setIsItalicActive(activeEditor.isActive("italic")); // Update state immediately
            }
          }}
          className={`px-2 py-1 rounded ${
            isItalicActive ? "bg-blue-500 text-white" : "bg-gray-100"
          }`}
        >
          Italic
        </button>
        <button
          onClick={() => {
            if (activeEditor) {
              activeEditor.chain().focus().toggleUnderline().run();
              setIsUnderlineActive(activeEditor.isActive("underline")); // Update state immediately
            }
          }}
          className={`px-2 py-1 rounded ${
            isUnderlineActive ? "bg-blue-500 text-white" : "bg-gray-100"
          }`}
        >
          Underline
        </button>
        <button
          onClick={() => {
            if (activeEditor) {
              activeEditor.chain().focus().toggleStrike().run();
              setIsStrikeActive(activeEditor.isActive("strike")); // Update state immediately
            }
          }}
          className={`px-2 py-1 rounded ${
            isStrikeActive ? "bg-blue-500 text-white" : "bg-gray-100"
          }`}
        >
          Strike
        </button>
      </div>

      <div className="col-span-full h-fit">
        <DndProvider backend={HTML5Backend}>
          <div className="flex flex-col gap-4">
            {blocks.map((block, index) => (
              <DraggableBlock
                key={block.id}
                id={block.id}
                index={index}
                moveBlock={moveBlock}
                content={block.content}
                setActiveEditor={setActiveEditor}
                onSelectionUpdate={onSelectionUpdate} // Pass the update function
                updateBlockContent={updateBlockContent} // Pass the update function
              />
            ))}
          </div>
        </DndProvider>
      </div>

      <div className="col-span-full flex flex-row gap-2">
        {/* Button to add a new block */}
        <button
          className="w-48 h-12 rounded-full bg-white border border-black p-4 flex items-center justify-center"
          onClick={addNewBlock}
        >
          Add New Block
        </button>

        <button
          className="w-48 h-12 rounded-full bg-black text-white p-4 flex items-center justify-center"
          onClick={saveDocument}
        >
          Save
        </button>
      </div>
    </BaseLayout>
  );
}
