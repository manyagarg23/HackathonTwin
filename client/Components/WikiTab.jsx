import React, { useEffect, useState } from "react";

function WikiTab() {
  const [files, setFiles] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const API_BASE_URL = "http://localhost:8000/api";

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/get_wiki`);
        if (!res.ok) throw new Error("Failed to fetch files");
        const data = await res.json();
        setFiles(data); // Assuming API returns an array like [{name, content, uploaded_at}, ...]
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchFiles();
  }, []);

  if (loading) return <p className="text-gray-600">Loading...</p>;
  if (error) return <p className="text-red-500">Error: {error}</p>;

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Uploaded Logistics</h2>

      {files.length === 0 ? (
        <p className="text-gray-600">No files uploaded yet.</p>
      ) : (
        <ul className="border rounded divide-y">
          {files.map((file, idx) => (
            <li
              key={idx}
              className="p-3 hover:bg-gray-100 cursor-pointer"
              onClick={() => setSelectedFile(file)}
            >
              <div className="flex justify-between">
                <span className="font-medium">{file.name || `File ${idx + 1}`}</span>
                {file.uploaded_at && (
                  <span className="text-sm text-gray-500">
                    {new Date(file.uploaded_at).toLocaleString()}
                  </span>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}

      {selectedFile && (
        <div className="p-4 bg-gray-50 border rounded">
          <h3 className="font-semibold mb-2">{selectedFile.name}</h3>
          <pre className="overflow-auto max-h-96 bg-white p-3 border rounded text-sm">
            {selectedFile.content}
          </pre>
          <button
            onClick={() => setSelectedFile(null)}
            className="mt-3 px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-700"
          >
            Close
          </button>
        </div>
      )}
    </div>
  );
}

export default WikiTab;
