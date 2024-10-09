import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import BaseLayout from "../../layouts/BaseLayout/BaseLayout";
import EditorLayout from "../../layouts/EditorLayout/EditorLayout";
import { Reorder, useDragControls } from "framer-motion";
import DraggableBlock from "../../components/DraggableBlock/DraggableBlock";
import "./Editor.css";

export default function Editor() {
  const { id } = useParams();
  const [doc, setDoc] = useState(null);
  const [blocks, setBlocks] = useState([]);
  const [activeEditor, setActiveEditor] = useState(null);
  const [selectedBlockType, setSelectedBlockType] = useState(null);
  const [isBoldActive, setIsBoldActive] = useState(false);
  const [isItalicActive, setIsItalicActive] = useState(false);
  const [isUnderlineActive, setIsUnderlineActive] = useState(false);
  const [isStrikeActive, setIsStrikeActive] = useState(false);
  const [fontFamily, setFontFamily] = useState("default");
  const [fontSize, setFontSize] = useState("default");

  const controls = useDragControls();

  useEffect(() => {
    const storedDocuments = JSON.parse(localStorage.getItem("documents")) || [];
    const docData = storedDocuments.find((doc) => doc.id === parseInt(id));
    if (docData) {
      setDoc(docData);
      setBlocks(docData.content || []); // Ensure content is an array
    }
  }, [id]);

  const addNewBlock = (type) => {
    let fontSize;
    let fontFamily;

    // Assign styles based on the block type
    switch (type) {
      case "heading":
        fontSize = "24px";
        fontFamily = "Arial";
        break;
      case "subheading":
        fontSize = "18px";
        fontFamily = "Georgia";
        break;
      case "paragraph":
        fontSize = "14px";
        fontFamily = "Times New Roman";
        break;
      default:
        fontSize = "14px"; // Default font size
        fontFamily = "default";
    }

    const newBlock = {
      id: `${blocks.length}-${Date.now()}`, // Ensure unique ID
      content: "", // Empty content
      fontFamily: fontFamily,
      fontSize: fontSize,
    };
    const updatedBlocks = [...blocks, newBlock];
    setBlocks(updatedBlocks);

    const storedDocuments = JSON.parse(localStorage.getItem("documents")) || [];
    const updatedDocuments = storedDocuments.map((document) => {
      if (document.id === parseInt(id)) {
        return { ...document, content: updatedBlocks };
      }
      return document;
    });
    localStorage.setItem("documents", JSON.stringify(updatedDocuments));
  };

  const updateBlockContent = (index, newContent) => {
    const updatedBlocks = [...blocks];
    if (updatedBlocks[index]) {
      // Check if the index is valid
      updatedBlocks[index].content = newContent;
      setBlocks(updatedBlocks);

      const storedDocuments = JSON.parse(localStorage.getItem("documents")) || [];
      const updatedDocuments = storedDocuments.map((document) => {
        if (document.id === parseInt(id)) {
          return { ...document, content: updatedBlocks };
        }
        return document;
      });
      localStorage.setItem("documents", JSON.stringify(updatedDocuments));
    } else {
      console.error(`Block at index ${index} does not exist.`);
    }
  };

  const saveDocument = () => {
    const nonEmptyBlocks = blocks.filter((block) => block.content.trim() !== "");
    const storedDocuments = JSON.parse(localStorage.getItem("documents")) || [];
    const updatedDocuments = storedDocuments.map((document) => {
      if (document.id === parseInt(id)) {
        return { ...document, content: nonEmptyBlocks };
      }
      return document;
    });

    localStorage.setItem("documents", JSON.stringify(updatedDocuments));
    setBlocks(nonEmptyBlocks);
    console.log("Document saved:", nonEmptyBlocks);
  };

  const onSelectionUpdate = (editor) => {
    if (!editor) return;

    setIsBoldActive(editor.isActive("bold"));
    setIsItalicActive(editor.isActive("italic"));
    setIsUnderlineActive(editor.isActive("underline"));
    setIsStrikeActive(editor.isActive("strike"));
    setFontFamily(editor.getAttributes("textStyle").fontFamily || "default");
    setFontSize(editor.getAttributes("textStyle").fontSize || "default");
  };

  if (!doc) {
    return <div>Loading...</div>;
  }

  return (
    <BaseLayout>
      <EditorLayout title={doc.title}>
        {/* Global Toolbar */}
        <div className="col-span-full flex flex-row gap-2 h-fit rounded border border-black p-2">
          <button
            onClick={() => {
              if (activeEditor) {
                activeEditor.chain().focus().toggleBold().run();
                setIsBoldActive(activeEditor.isActive("bold"));
              }
            }}
            className={`px-2 py-1 rounded ${isBoldActive ? "bg-blue-500 text-white" : "bg-gray-100"}`}
          >
            Bold
          </button>
          <button
            onClick={() => {
              if (activeEditor) {
                activeEditor.chain().focus().toggleItalic().run();
                setIsItalicActive(activeEditor.isActive("italic"));
              }
            }}
            className={`px-2 py-1 rounded ${isItalicActive ? "bg-blue-500 text-white" : "bg-gray-100"}`}
          >
            Italic
          </button>
          <button
            onClick={() => {
              if (activeEditor) {
                activeEditor.chain().focus().toggleUnderline().run();
                setIsUnderlineActive(activeEditor.isActive("underline"));
              }
            }}
            className={`px-2 py-1 rounded ${isUnderlineActive ? "bg-blue-500 text-white" : "bg-gray-100"}`}
          >
            Underline
          </button>
          <button
            onClick={() => {
              if (activeEditor) {
                activeEditor.chain().focus().toggleStrike().run();
                setIsStrikeActive(activeEditor.isActive("strike"));
              }
            }}
            className={`px-2 py-1 rounded ${isStrikeActive ? "bg-blue-500 text-white" : "bg-gray-100"}`}
          >
            Strike
          </button>
        </div>

        {/* Block Type Selection */}
        <div className="col-span-full flex flex-row gap-2 h-fit rounded border border-black p-2">
          <select onChange={(e) => setSelectedBlockType(e.target.value)} value={selectedBlockType}>
            <option value="" disabled>Select Block Type</option>
            <option value="heading">Heading</option>
            <option value="subheading">Subheading</option>
            <option value="paragraph">Paragraph</option>
          </select>
          <button
            className="w-48 h-12 rounded-full bg-white border border-black p-4 flex items-center justify-center"
            onClick={() => addNewBlock(selectedBlockType)} // Pass selected type
            disabled={!selectedBlockType}
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

        <div className="col-span-full h-fit">
          <Reorder.Group
            values={blocks}
            onReorder={(newOrder) => setBlocks(newOrder)} // Ensure proper reordering
            className="flex flex-col gap-4"
          >
            {blocks.map((block, index) => (
              <DraggableBlock
                key={block.id} // Ensure stable key
                block={block}
                index={index}
                setActiveEditor={setActiveEditor}
                onSelectionUpdate={onSelectionUpdate}
                updateBlockContent={updateBlockContent}
                onPointerDown={(e) => controls.start(e)}
              />
            ))}
          </Reorder.Group>
        </div>
      </EditorLayout>
    </BaseLayout>
  );
}
