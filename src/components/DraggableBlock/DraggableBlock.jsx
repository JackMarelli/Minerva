import { useEditor, EditorContent, BubbleMenu } from "@tiptap/react";
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
      {/* Bubble Menu */}
      {editor && (
        <BubbleMenu
          editor={editor}
          tippyOptions={{ duration: 100 }}
          className="bg-white shadow-md border rounded p-2 flex space-x-2"
        >
          <button
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={editor.isActive("bold") ? "active-btn" : ""}
          >
            Bold
          </button>
          <button
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={editor.isActive("italic") ? "active-btn" : ""}
          >
            Italic
          </button>
          <button
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            className={editor.isActive("underline") ? "active-btn" : ""}
          >
            Underline
          </button>
          <button
            onClick={() => editor.chain().focus().toggleStrike().run()}
            className={editor.isActive("strike") ? "active-btn" : ""}
          >
            Strike
          </button>
        </BubbleMenu>
      )}
      <EditorContent editor={editor} />
    </div>
  );
}

export default DraggableBlock;
