import React, { useState } from "react";
import ChatMessage from "@/components/ChatMessage";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

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
      const res = await fetch("https://your-vercel-deployment.vercel.app/query", {
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
      <Card className="w-full max-w-2xl flex flex-col h-[80vh] border-none bg-[#f8fafc]">
        <CardContent className="flex-1 overflow-hidden">
          <ScrollArea className="h-full pr-2">
            <div className="flex flex-col space-y-2">
              {messages.map((msg, idx) => (
                <ChatMessage key={idx} message={msg.message} isUser={msg.isUser} />
              ))}
              {loading && <ChatMessage message="Thinking..." isUser={false} />}
            </div>
          </ScrollArea>
        </CardContent>
        <form
          className="flex items-center space-x-2 p-4 border-t border-gray-200"
          onSubmit={(e) => {
            e.preventDefault();
            sendMessage();
          }}
        >
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask something..."
            className="flex-1 rounded-full bg-white text-[#1e293b] shadow-sm"
          />
          <Button
            type="submit"
            className="bg-[#8b5cf6] text-white rounded-full px-6 py-2"
            disabled={loading}
          >
            {loading ? "..." : "Send"}
          </Button>
        </form>
      </Card>
    </div>
  );
}
