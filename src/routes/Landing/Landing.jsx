import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

export default function Landing() {
  const [documents, setDocuments] = useState([]);

  useEffect(() => {
    fetch("/data/data.json") // Fetch documents from JSON
      .then((response) => response.json())
      .then((data) => setDocuments(data.documents)) // Access the "documents" key
      .catch((error) => console.error("Error fetching documents:", error));
  }, []);

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-4xl font-bold mb-8 text-center">Documents</h1>
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
    </div>
  );
}
