import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useEditor, EditorContent, FloatingMenu } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Bold from "@tiptap/extension-bold";
import Italic from "@tiptap/extension-italic";
import Underline from "@tiptap/extension-underline";
import Strike from "@tiptap/extension-strike";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import BaseLayout from "../../layouts/BaseLayout/BaseLayout";

// Define the drag-and-drop types
const ItemTypes = {
  BLOCK: 'block',
};

// A draggable block component
function DraggableBlock({ id, index, moveBlock, content }) {
  const [, ref] = useDrag({
    type: ItemTypes.BLOCK,
    item: { id, index },
  });

  const [, drop] = useDrop({
    accept: ItemTypes.BLOCK,
    hover: (draggedItem) => {
      if (draggedItem.index !== index) {
        moveBlock(draggedItem.index, index);
        draggedItem.index = index;
      }
    },
  });

  // Create an editor for each block
  const editor = useEditor({
    extensions: [StarterKit, Bold, Italic, Underline, Strike],
    content: content || "",
  });

  return (
    <div
      ref={(node) => ref(drop(node))}
      className="cursor-move h-fit rounded-xl border border-gray-300 px-5 py-3"
    >
      <EditorContent editor={editor} />
      
      {/* Floating toolbar when text is selected */}
      {editor && (
        <FloatingMenu editor={editor} tippyOptions={{ duration: 100 }}>
          <div className="flex space-x-2 bg-white shadow-lg p-2 rounded">
            <button
              onClick={() => editor.chain().focus().toggleBold().run()}
              className={`px-2 py-1 rounded ${editor.isActive('bold') ? 'bg-blue-500 text-white' : 'bg-gray-100'}`}
            >
              Bold
            </button>
            <button
              onClick={() => editor.chain().focus().toggleItalic().run()}
              className={`px-2 py-1 rounded ${editor.isActive('italic') ? 'bg-blue-500 text-white' : 'bg-gray-100'}`}
            >
              Italic
            </button>
            <button
              onClick={() => editor.chain().focus().toggleUnderline().run()}
              className={`px-2 py-1 rounded ${editor.isActive('underline') ? 'bg-blue-500 text-white' : 'bg-gray-100'}`}
            >
              Underline
            </button>
            <button
              onClick={() => editor.chain().focus().toggleStrike().run()}
              className={`px-2 py-1 rounded ${editor.isActive('strike') ? 'bg-blue-500 text-white' : 'bg-gray-100'}`}
            >
              Strike
            </button>
          </div>
        </FloatingMenu>
      )}
    </div>
  );
}

export default function Editor() {
  const { id } = useParams();
  const [doc, setDoc] = useState(null);
  const [blocks, setBlocks] = useState([]);

  useEffect(() => {
    // Fetch document data
    fetch("/data/data.json")
      .then((response) => response.json())
      .then((data) => {
        const docData = data.documents.find((doc) => doc.id === parseInt(id));
        if (docData) {
          setDoc(docData);
          setBlocks(docData.content); // Assuming content is an array of blocks
        }
      })
      .catch((error) => console.error("Error loading document:", error));
  }, [id]);

  // Move block to rearrange them
  const moveBlock = (fromIndex, toIndex) => {
    const updatedBlocks = [...blocks];
    const [movedBlock] = updatedBlocks.splice(fromIndex, 1);
    updatedBlocks.splice(toIndex, 0, movedBlock);
    setBlocks(updatedBlocks);
  };

  const saveDocument = () => {
    console.log("Document saved:", blocks);
    // You can send the updated `blocks` state to your backend or save it locally
  };

  if (!doc) {
    return <div>Loading...</div>;
  }

  return (
    <BaseLayout>
      <h1 className="col-span-full text-3xl font-bold">{doc.title}</h1>
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
              />
            ))}
          </div>
        </DndProvider>
      </div>
      <button
        className="w-48 h-12 rounded-full bg-blue-700 hover:bg-blue-800 text-white mt-6"
        onClick={saveDocument}
      >
        Save
      </button>
    </BaseLayout>
  );
}
