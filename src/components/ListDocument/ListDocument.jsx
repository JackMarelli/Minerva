import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";

const ListDocument = ({ doc, onRename, onDuplicate, onDelete }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };

  const handleRename = () => {
    const newName = prompt("Enter new document name:", doc.title);
    if (newName) {
      onRename(doc.id, newName);
    }
    setIsMenuOpen(false); // Close the menu after renaming
  };

  const handleDuplicate = () => {
    onDuplicate(doc);
    setIsMenuOpen(false); // Close the menu after duplicating
  };

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this document?")) {
      onDelete(doc.id);
    }
    setIsMenuOpen(false); // Close the menu after deleting
  };

  // Close menu when clicking outside or scrolling
  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };

    const handleScroll = () => {
      setIsMenuOpen(false);
    };

    // Add event listeners
    document.addEventListener("click", handleOutsideClick);
    document.addEventListener("scroll", handleScroll);

    // Cleanup listeners on component unmount
    return () => {
      document.removeEventListener("click", handleOutsideClick);
      document.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <li className="w-full bg-white border border-black rounded-full flex justify-between items-center px-6 py-4">
      <Link to={`/document/${doc.id}`} className="flex-grow h-full">
        <span className="text-black hover:underline">{doc.title}</span>
      </Link>
      <div className="relative" ref={menuRef}>
        <button
          onClick={toggleMenu}
          className="text-gray-500 hover:text-black relative"
        >
          Options
        </button>
        {isMenuOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-white border rounded shadow-lg z-10 flex flex-col items-end justify-start">
            
            <button
              onClick={handleRename}
              className="block w-fit alight-self-end text-left p-2 text-end"
            >
              Close
            </button>
            <button
              onClick={handleRename}
              className="block w-full text-left p-2 hover:bg-gray-200"
            >
              Rename
            </button>
            <button
              onClick={handleDuplicate}
              className="block w-full text-left p-2 hover:bg-gray-200"
            >
              Duplicate
            </button>
            <button
              onClick={handleDelete}
              className="block w-full text-left p-2 hover:bg-gray-200"
            >
              Delete
            </button>
          </div>
        )}
      </div>
    </li>
  );
};

export default ListDocument;
