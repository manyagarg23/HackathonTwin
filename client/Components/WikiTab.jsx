import React, { useEffect, useRef, useState } from "react";

function WikiTab() {
  const [files, setFiles] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // RAG chat state
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState("");
  const [chatSending, setChatSending] = useState(false);
  const [chatError, setChatError] = useState("");
  const [ragSessionId, setRagSessionId] = useState(null);
  const chatEndRef = useRef(null);

  // Convert various server/client error payloads into readable strings
  const toReadableError = (value) => {
    if (value == null) return "Unknown error";
    if (typeof value === "string") return value;
    if (value?.message && typeof value.message === "string") return value.message;
    try {
      return JSON.stringify(value);
    } catch (_) {
      return String(value);
    }
  };

  const API_BASE_URL = "http://localhost:8000/api";

  useEffect(() => {
    let createdObjectUrls = [];

    const fetchFiles = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/get_wiki`);

        if (!res.ok) {
          // Try to parse JSON error body if available
          try {
            const errJson = await res.json();
            throw new Error(errJson?.detail || "Failed to fetch wiki");
          } catch (_) {
            throw new Error("Failed to fetch wiki");
          }
        }

        const contentType = res.headers.get("content-type") || "";
        const contentDisposition = res.headers.get("content-disposition") || "";

        // Extract filename from Content-Disposition if present
        let filename = "Wiki.pdf";
        const match = contentDisposition.match(/filename="?([^";]+)"?/i);
        if (match && match[1]) filename = match[1];

        // Read as blob and create object URL
        const blob = await res.blob();
        const url = URL.createObjectURL(blob);
        createdObjectUrls.push(url);

        const fileEntry = { name: filename, url, contentType };
        setFiles([fileEntry]);
        setSelectedFile(fileEntry);
      } catch (err) {
        setError(err.message || "Failed to load wiki");
      } finally {
        setLoading(false);
      }
    };

    fetchFiles();

    return () => {
      // Cleanup any object URLs we created
      createdObjectUrls.forEach((u) => URL.revokeObjectURL(u));
    };
  }, []);

  // Auto-scroll chat to bottom on new messages
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  const sendChatMessage = async (e) => {
    e?.preventDefault?.();
    if (!chatInput.trim() || chatSending) return;
    setChatError("");
    setChatSending(true);

    const userMessage = { role: "user", text: chatInput.trim() };
    setChatMessages((prev) => [...prev, userMessage]);

    try {
      // Build payload without session_id if not available to avoid null validation errors
      const payload = { message: userMessage.text };
      if (ragSessionId) payload.session_id = ragSessionId;

      const res = await fetch(`${API_BASE_URL}/rag/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        // Try to parse JSON error body if available
        let detail = "Failed to contact RAG chat";
        try {
          const contentType = res.headers.get("content-type") || "";
          if (contentType.includes("application/json")) {
            const errJson = await res.json();
            detail = errJson?.detail ?? errJson ?? detail;
          } else {
            const text = await res.text();
            detail = text || detail;
          }
        } catch (_) {
          // noop
        }
        throw new Error(toReadableError(detail));
      }

      const data = await res.json();
      if (data?.session_id && !ragSessionId) setRagSessionId(data.session_id);

      setChatMessages((prev) => [
        ...prev,
        { role: "assistant", text: typeof data?.response === "string" ? data.response : toReadableError(data?.response) },
      ]);
    } catch (err) {
      const message = toReadableError(err);
      setChatError(message);
      setChatMessages((prev) => [
        ...prev,
        { role: "assistant", text: `Error: ${message}` },
      ]);
    } finally {
      setChatInput("");
      setChatSending(false);
    }
  };

  if (loading) return <p className="text-gray-600">Loading...</p>;
  if (error) return <p className="text-red-500">Error: {error}</p>;

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Wiki</h2>

      <div className="flex gap-4">
        {/* Left: Wiki document list and viewer */}
        <div className="flex-1 space-y-4">
          <h3 className="text-base font-medium">Wiki Document</h3>
          {files.length === 0 ? (
            <p className="text-gray-600">No wiki PDF found.</p>
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
                  </div>
                </li>
              ))}
            </ul>
          )}

          {selectedFile && (
            <div className="p-4 bg-gray-50 border rounded">
              <h4 className="font-semibold mb-2">{selectedFile.name}</h4>
              {selectedFile.contentType?.includes("pdf") ? (
                <object
                  data={selectedFile.url}
                  type="application/pdf"
                  width="100%"
                  height="600px"
                >
                  <p>
                    Unable to display PDF. You can download it{" "}
                    <a
                      className="text-blue-600 underline"
                      href={selectedFile.url}
                      download={selectedFile.name}
                    >
                      here
                    </a>
                    .
                  </p>
                </object>
              ) : (
                <div className="overflow-auto max-h-96 bg-white p-3 border rounded text-sm">
                  <a
                    className="text-blue-600 underline"
                    href={selectedFile.url}
                    download={selectedFile.name}
                  >
                    Download file
                  </a>
                </div>
              )}
              <button
                onClick={() => setSelectedFile(null)}
                className="mt-3 px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-700"
              >
                Close
              </button>
            </div>
          )}
        </div>

        {/* Right: RAG Chat Sidebar */}
        <div className="w-full md:w-96 border rounded flex flex-col">
          <div className="px-3 py-2 border-b bg-gray-50">
            <div className="flex items-center justify-between">
              <span className="font-medium">Wiki Chat (RAG)</span>
              {ragSessionId && (
                <span className="text-xs text-gray-500">Session: {ragSessionId.slice(0, 8)}...</span>
              )}
            </div>
            <p className="text-xs text-gray-500 mt-1">Ask questions about the uploaded wiki.</p>
            {chatError && (
              <p className="text-xs text-red-600 mt-1">{chatError}</p>
            )}
          </div>

          <div className="flex-1 overflow-auto p-3 space-y-2 bg-white">
            {chatMessages.length === 0 ? (
              <div className="text-sm text-gray-500">Start the conversation by asking a question.</div>
            ) : (
              chatMessages.map((m, idx) => (
                <div
                  key={idx}
                  className={
                    m.role === "user"
                      ? "text-sm bg-blue-50 border border-blue-100 p-2 rounded self-end"
                      : "text-sm bg-gray-50 border border-gray-100 p-2 rounded"
                  }
                >
                  <span className="block font-medium mb-1">{m.role === "user" ? "You" : "Assistant"}</span>
                  <span className="whitespace-pre-wrap">{m.text}</span>
                </div>
              ))
            )}
            <div ref={chatEndRef} />
          </div>

          <form onSubmit={sendChatMessage} className="p-2 border-t bg-gray-50 flex gap-2">
            <input
              type="text"
              className="flex-1 px-3 py-2 border rounded text-sm"
              placeholder="Ask about the wiki..."
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              disabled={chatSending}
            />
            <button
              type="submit"
              className="px-3 py-2 bg-gray-800 text-white rounded disabled:opacity-50"
              disabled={chatSending || !chatInput.trim()}
            >
              {chatSending ? "Sending..." : "Send"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default WikiTab;
