import { useEditor, EditorContent, BubbleMenu } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Bold from "@tiptap/extension-bold";
import Italic from "@tiptap/extension-italic";
import Underline from "@tiptap/extension-underline";
import Strike from "@tiptap/extension-strike";
import TextStyle from "@tiptap/extension-text-style";
import FontFamily from "@tiptap/extension-font-family";
import FontSize from "tiptap-extension-font-size";
import Placeholder from "@tiptap/extension-placeholder";
import "./DraggableBlock.css";
import { useDrag, useDrop } from "react-dnd";
import { useRef } from "react";
import { throttle } from "lodash"; // Import lodash throttle for smoother hover

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
  const ref = useRef(null);

  const [, dragRef] = useDrag({
    type: ItemTypes.BLOCK,
    item: { id, index },
  });

  const [, drop] = useDrop({
    accept: ItemTypes.BLOCK,
    hover: throttle((draggedItem, monitor) => {
      if (!ref.current) return;

      const hoverBoundingRect = ref.current.getBoundingClientRect();
      const hoverMiddleY =
        (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;

      const clientOffset = monitor.getClientOffset();
      const hoverClientY = clientOffset.y - hoverBoundingRect.top;

      // Only move when the hover position crosses the middle line
      if (draggedItem.index < index && hoverClientY > hoverMiddleY) {
        moveBlock(draggedItem.index, index);
        draggedItem.index = index;
      } else if (draggedItem.index > index && hoverClientY < hoverMiddleY) {
        moveBlock(draggedItem.index, index);
        draggedItem.index = index;
      }
    }, 100), // Add throttle to reduce flickering and improve performance
  });

  const editor = useEditor({
    extensions: [
      StarterKit,
      Bold,
      Italic,
      Underline,
      Strike,
      TextStyle, // Needed for custom font size and family
      FontFamily.configure({
        types: ["textStyle"],
      }),
      FontSize.configure({
        types: ["textStyle"],
      }),
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
      ref={(node) => {
        ref.current = node;
        drop(node);
      }}
      className="draggable-block flex items-center space-x-4 h-fit rounded-xl border border-gray-300 px-5 py-3 transition-all duration-300 ease-in-out"
    >
      {/* Drag Handle */}
      <div
        ref={dragRef}
        className="cursor-move w-5 h-full bg-gray-200 flex items-center justify-center"
        style={{ minWidth: '24px' }}
        title="Drag block"
      >
        <span>::</span> {/* This can be any drag handle icon or text */}
      </div>

      {/* Block Content */}
      <div className="flex-1">
        {/* Bubble Menu */}
        {editor && (
          <BubbleMenu
            editor={editor}
            className="bg-white shadow-md border rounded p-2 flex space-x-2"
          >
            <button onClick={() => editor.chain().focus().toggleBold().run()}>
              Bold
            </button>
            <button onClick={() => editor.chain().focus().toggleItalic().run()}>
              Italic
            </button>

            {/* Font Family Dropdown */}
            <select
              onChange={(e) =>
                editor.chain().focus().setFontFamily(e.target.value).run()
              }
              value={editor.getAttributes("textStyle").fontFamily || "default"}
            >
              <option value="default">Default</option>
              <option value="Arial">Arial</option>
              <option value="Courier New">Courier New</option>
              <option value="Georgia">Georgia</option>
              <option value="Times New Roman">Times New Roman</option>
            </select>

            {/* Font Size Dropdown */}
            <select
              onChange={(e) =>
                editor.chain().focus().setFontSize(e.target.value).run()
              }
              value={editor.getAttributes("textStyle").fontSize || "default"}
            >
              <option value="default">Default</option>
              <option value="12px">12px</option>
              <option value="14px">14px</option>
              <option value="16px">16px</option>
              <option value="20px">20px</option>
              <option value="24px">24px</option>
            </select>
          </BubbleMenu>
        )}
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}

export default DraggableBlock;
