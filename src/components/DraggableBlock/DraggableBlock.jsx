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
import { Reorder, useDragControls } from "framer-motion";
import "./DraggableBlock.css";

import { useRef, useEffect } from "react";

function DraggableBlock({
  index,
  block,
  onPointerDown,
  setActiveEditor,
  onSelectionUpdate,
  updateBlockContent,
}) {
  const ref = useRef(null);
  const controls = useDragControls();

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
        placeholder: "Write something...",
      }),
    ],
    content: block.content || "<p></p>", // Default content to prevent undefined issues
    onUpdate: ({ editor }) => {
      if (updateBlockContent && typeof updateBlockContent === "function") {
        // Ensure updateBlockContent is a function
        updateBlockContent(index, editor.getHTML()); // Update block content
        setActiveEditor(editor); // Set active editor
      } else {
        console.error("updateBlockContent is not a function or is undefined");
      }
    },
    onSelectionUpdate: () => {
      onSelectionUpdate(editor); // Handle selection update
    },
    onFocus: () => {
      setActiveEditor(editor); // Set active editor on focus
    },
  });

  // Apply default font family and size on first render
  useEffect(() => {
    if (editor && editor.isEmpty) {
      editor
        .chain()
        .focus()
        .setFontFamily(block.fontFamily || "default")
        .setFontSize(block.fontSize || "14px")
        .run();
    }
  }, [editor, block.fontFamily, block.fontSize]);

  return (
    <Reorder.Item
      key={block.id}
      value={block}
      dragListener={false}
      dragControls={controls}
    >
      <div
        ref={ref}
        className="relative draggable-block flex items-center h-fit transition-all duration-300 ease-in-out border border-green-700"
      >
        {/* Drag Handle */}
        <div
          className="absolute top-0 -left-8 cursor-move w-fit h-fit flex items-center justify-start px-3 pt-1 handle border border-red-700"
          title="Drag block"
          onPointerDown={(event) => controls.start(event)}
        >
          <img src="/assets/images/svg/drag-handle.svg" alt="" />{" "}
        </div>

        {/* Block Content */}
        <div className="flex-1">
          {/* Bubble Menu */}
          {editor && (
            <BubbleMenu
              editor={editor}
              className="bg-white shadow-md border rounded p-2 flex"
            >
              <button onClick={() => editor.chain().focus().toggleBold().run()}>
                Bold
              </button>
              <button
                onClick={() => editor.chain().focus().toggleItalic().run()}
              >
                Italic
              </button>

              {/* Font Family Dropdown */}
              <select
                onChange={(e) =>
                  editor.chain().focus().setFontFamily(e.target.value).run()
                }
                value={
                  editor.getAttributes("textStyle").fontFamily || "default"
                }
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
                value={editor.getAttributes("textStyle").fontSize || "14px"}
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
    </Reorder.Item>
  );
}

export default DraggableBlock;
