import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Bold from "@tiptap/extension-bold";
import Italic from "@tiptap/extension-italic";
import Underline from "@tiptap/extension-underline";
import Strike from "@tiptap/extension-strike";
import Placeholder from "@tiptap/extension-placeholder";
import "./DraggableBlock.css";

import { useDrag, useDrop } from "react-dnd";

const ItemTypes = {
  BLOCK: "block",
};

function DraggableBlock({
  id,
  index,
  moveBlock,
  content,
  setActiveEditor,
  onSelectionUpdate,
  updateBlockContent,
}) {
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

  const editor = useEditor({
    extensions: [
      StarterKit,
      Bold,
      Italic,
      Underline,
      Strike,
      Placeholder.configure({
        placeholder: "Write something …",
      }),
    ],
    content: content || "",
    onUpdate: ({ editor }) => {
      updateBlockContent(index, editor.getHTML()); // Update block content
      setActiveEditor(editor);
    },
    onSelectionUpdate: () => {
      onSelectionUpdate(editor);
    },
    onFocus: () => {
      setActiveEditor(editor); // Set active editor on focus
    },
  });

  return (
    <div
      ref={(node) => ref(drop(node))}
      className="cursor-move h-fit rounded-xl border border-gray-300 px-5 py-3"
    >
      <EditorContent editor={editor} />
    </div>
  );
}

export default DraggableBlock;
