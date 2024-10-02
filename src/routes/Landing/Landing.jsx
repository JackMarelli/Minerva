import { useEffect, useState } from "react";
import BaseLayout from "../../layouts/BaseLayout/BaseLayout";
import ListDocument from "../../components/ListDocument/ListDocument";

export default function Landing() {
  const [documents, setDocuments] = useState([]);

  // Load documents from localStorage
  useEffect(() => {
    const storedDocuments = JSON.parse(localStorage.getItem("documents")) || [];
    setDocuments(storedDocuments);
  }, []);

  // Create a new document and save it to localStorage
  const createNewDocument = () => {
    const newDocument = {
      id: Date.now(), // Generate a unique ID based on current timestamp
      title: `New Document`, // Example title
      content: [{ id: 0, content: "" }], // The first block gets an ID of block0
    };

    // Update the documents array
    const updatedDocuments = [...documents, newDocument];

    // Save to localStorage
    localStorage.setItem("documents", JSON.stringify(updatedDocuments));

    // Update the state to re-render the component
    setDocuments(updatedDocuments);
  };

  const renameDocument = (id, newName) => {
    const updatedDocuments = documents.map((doc) => {
      if (doc.id === id) {
        return { ...doc, title: newName };
      }
      return doc;
    });
    localStorage.setItem("documents", JSON.stringify(updatedDocuments));
    setDocuments(updatedDocuments);
  };

  const duplicateDocument = (doc) => {
    const duplicatedDoc = { ...doc, id: Date.now() }; // Clone and give a new ID
    const updatedDocuments = [...documents, duplicatedDoc];
    localStorage.setItem("documents", JSON.stringify(updatedDocuments));
    setDocuments(updatedDocuments);
  };

  const deleteDocument = (id) => {
    const updatedDocuments = documents.filter((doc) => doc.id !== id);
    localStorage.setItem("documents", JSON.stringify(updatedDocuments));
    setDocuments(updatedDocuments);
  };

  return (
    <BaseLayout>
      <h1 className="col-span-full text-4xl font-bold font-mono mb-8">
        Documents
      </h1>
      {documents && documents.length !== 0 ? (
        <ul className="col-span-full flex flex-col border-t border-slate-300">
          {documents.map((doc) => (
            <ListDocument
              key={doc.id}
              doc={doc}
              onRename={renameDocument}
              onDuplicate={duplicateDocument}
              onDelete={deleteDocument}
            />
          ))}
        </ul>
      ) : (
        <span>No documents found</span>
      )}
      {/* Button to create a new document */}
      <div className="col-span-full flex mt-4">
        <button
          onClick={createNewDocument}
          className="w-fit h-12 rounded-full bg-white border border-black p-4 flex items-center justify-center"
        >
          New Document
        </button>
      </div>
    </BaseLayout>
  );
}
