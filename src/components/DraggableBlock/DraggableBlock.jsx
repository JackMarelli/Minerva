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
      FontSize.configure({
        types: ['textStyle'],
      }),
      FontFamily.configure({
        types: ['textStyle'],
      }),
      TextStyle,
      Placeholder.configure({
        placeholder: "Start typing...",
      }),
    ],
    content: block.content,
    onUpdate: ({ editor }) => {
      updateBlockContent(index, editor.getHTML());
    },
    onFocus: () => {
      setActiveEditor(editor);
    },
  });

  useEffect(() => {
    if (editor) {
      editor.commands.setFontFamily(block.fontFamily || "default");
      editor.commands.setFontSize(block.fontSize || "14px");
    }
  }, [editor, block.fontFamily, block.fontSize]);

  return (
    <div ref={ref} className="draggable-block" onPointerDown={(e) => controls.start(e)}>
      <BubbleMenu editor={editor} tippyOptions={{ duration: 100 }}>
        <button onClick={() => editor.chain().focus().toggleBold().run()} className="bubble-button">B</button>
        <button onClick={() => editor.chain().focus().toggleItalic().run()} className="bubble-button">I</button>
        <button onClick={() => editor.chain().focus().toggleUnderline().run()} className="bubble-button">U</button>
        <button onClick={() => editor.chain().focus().toggleStrike().run()} className="bubble-button">S</button>
      </BubbleMenu>

      <EditorContent editor={editor} />
    </div>
  );
}

export default DraggableBlock;
