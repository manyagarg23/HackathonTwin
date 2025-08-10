import React, { useState } from "react";

const WikiUpload = () => {
  const [file, setFile] = useState(null);
  const [fileContent, setFileContent] = useState("");
  const [message, setMessage] = useState("");

  const API_BASE_URL = "http://localhost:8000/api";

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);

    if (selectedFile) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setFileContent(event.target.result);
      };
      reader.readAsText(selectedFile);
    }
  };

  const uploadFile = async () => {
    if (!file) {
      setMessage("Please select a file first.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch(`${API_BASE_URL}/add_wiki`, {
        method: "POST",
        body: formData,
      });
      if (!res.ok) throw new Error("Upload failed");
      const data = await res.json();
      setMessage(data.message);
    } catch (err) {
      setMessage(`Error: ${err.message}`);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white border border-gray-200 rounded-lg shadow-sm space-y-4">
      <h2 className="text-lg font-medium text-gray-800">Upload File</h2>

      {/* File input */}
      <input
        type="file"
        onChange={handleFileChange}
        className="block w-full text-sm text-gray-600 file:mr-3 file:py-2 file:px-4
                   file:rounded-md file:border-0
                   file:bg-gray-900 file:text-white
                   hover:file:bg-gray-700
                   cursor-pointer"
      />

      {/* Display file contents */}
      {fileContent && (
        <pre className="max-h-48 overflow-auto p-3 bg-gray-100 text-sm border rounded">
          {fileContent}
        </pre>
      )}

      {/* Upload button */}
      <button
        onClick={uploadFile}
        className="w-full px-4 py-2 bg-gray-900 text-white rounded-md hover:bg-gray-700 transition-colors"
      >
        Upload
      </button>

      {/* Message */}
      {message && (
        <p className="mt-4 text-sm text-gray-700 border-t border-gray-200 pt-3">
          {message}
        </p>
      )}
    </div>
  );
};

export default WikiUpload;
