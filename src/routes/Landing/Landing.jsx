import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

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
      content: [
        { id: 0, content: "" }, // The first block gets an ID of block0
      ],
    };

    // Update the documents array
    const updatedDocuments = [...documents, newDocument];

    // Save to localStorage
    localStorage.setItem("documents", JSON.stringify(updatedDocuments));

    // Update the state to re-render the component
    setDocuments(updatedDocuments);
  };
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-4xl font-bold font-mono mb-8">Documents</h1>
      {documents && documents.length !== 0 ? (
        <ul className="space-y-4">
          {documents.map((doc) => (
            <li key={doc.id} className="bg-white shadow-md p-4 rounded-md">
              <Link
                to={`/document/${doc.id}`}
                className="text-blue-500 hover:underline"
              >
                {doc.title}
              </Link>
            </li>
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
    </div>
  );
}
