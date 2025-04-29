import React, { useState } from "react";

export default function RAGChat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { message: input, isUser: true };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("http://localhost:8000/query", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: input }),
      });

      const data = await res.json();
      setMessages((prev) => [...prev, { message: data.answer, isUser: false }]);
    } catch (err) {
      console.error(err);
      setMessages((prev) => [...prev, { message: "Error fetching response.", isUser: false }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-[#f8fafc] p-4">
      <div className="w-full max-w-2xl flex flex-col h-[80vh] bg-white shadow-md rounded-3xl overflow-hidden">
        <div className="flex-1 overflow-hidden p-4">
          <div className="h-full overflow-y-auto pr-2 flex flex-col space-y-2">
            {messages.map((msg, idx) => (
              <ChatMessage key={idx} message={msg.message} isUser={msg.isUser} />
            ))}
            {loading && <ChatMessage message="Thinking..." isUser={false} />}
          </div>
        </div>
        <form
          className="flex items-center space-x-2 p-4 border-t border-gray-200"
          onSubmit={(e) => {
            e.preventDefault();
            sendMessage();
          }}
        >
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask something..."
            className="flex-1 px-4 py-2 rounded-3xl bg-[#f8fafc] border border-gray-300 text-[#1e293b] focus:outline-none focus:ring-2 focus:ring-[#8b5cf6] transition"
          />
          <button
            type="submit"
            className="bg-[#8b5cf6] text-white px-6 py-2 rounded-3xl font-medium hover:bg-[#7c3aed] transition"
            disabled={loading}
          >
            {loading ? "..." : "Send"}
          </button>
        </form>
      </div>
    </div>
  );
}
