
import { useState } from "react";
import API from "../services/api";

interface Message {
  role: "user" | "assistant";
  text: string;
}

const AIChat = () => {
  const [isOpen, setIsOpen] = useState(false);

  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      text: "Hi! Welcome to SportNest. I'm your AI sports shopping assistant. How can I help you today?",
    },
  ]);

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const sendMessage = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!input.trim() || loading) return;

    const userMessage = input.trim();

    setMessages((prev) => [
      ...prev,
      { role: "user", text: userMessage },
    ]);

    setInput("");
    setLoading(true);

    try {
      const response = await API.post("/ai/chat", {
        message: userMessage,
      });

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text: response.data.reply,
        },
      ]);
    } catch (error) {
      console.error("AI Chat Error:", error);

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text: "Sorry! I am unable to respond right now. Please try again.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 flex h-[480px] w-[350px] max-w-[calc(100vw-32px)] flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl">

          {/* Header */}
          <div className="flex items-center justify-between bg-gradient-to-r from-blue-700 to-indigo-700 p-4 text-white">
            <div>
              <h2 className="text-lg font-bold">
                SportNest AI Assistant
              </h2>
              <p className="text-xs text-blue-100">
                Your sports shopping assistant
              </p>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="rounded-full p-2 text-xl hover:bg-white/20"
              aria-label="Close chat"
            >
              ✕
            </button>
          </div>

          {/* Messages */}
          <div className="flex flex-1 flex-col gap-3 overflow-y-auto bg-gray-50 p-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`max-w-[85%] rounded-xl p-3 text-sm ${
                  message.role === "user"
                    ? "ml-auto bg-blue-700 text-white"
                    : "mr-auto border bg-white text-gray-800"
                }`}
              >
                {message.text}
              </div>
            ))}

            {loading && (
              <div className="mr-auto rounded-xl border bg-white p-3 text-sm text-gray-500">
                AI is typing...
              </div>
            )}
          </div>

          {/* Message Input */}
          <form onSubmit={sendMessage} className="flex gap-2 border-t p-3">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about sports equipment..."
              className="min-w-0 flex-1 rounded-lg border px-3 py-2 text-sm outline-none focus:border-blue-600"
            />

            <button
              type="submit"
              disabled={!input.trim() || loading}
              className="rounded-lg bg-blue-700 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-800 disabled:opacity-50"
            >
              Send
            </button>
          </form>
        </div>
      )}

      {/* Floating AI Button */}
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="fixed bottom-6 right-6 z-50 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-indigo-700 text-3xl text-white shadow-xl transition-all duration-300 hover:scale-110 hover:shadow-2xl"
        aria-label="Open SportNest AI Assistant"
        title="Chat with SportNest AI"
      >
        {isOpen ? "✕" : "💬"}
      </button>
    </>
  );
};

export default AIChat;
