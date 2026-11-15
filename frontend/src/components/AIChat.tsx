
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

      
{/* Professional Floating AI Button */}
<button
  onClick={() => setIsOpen((prev) => !prev)}
  className="group fixed bottom-6 right-6 z-50 flex h-[68px] w-[68px] items-center justify-center rounded-full border-[3px] border-white bg-gradient-to-br from-blue-600 via-indigo-600 to-violet-700 text-white shadow-[0_8px_30px_rgba(37,99,235,0.4)] transition-all duration-300 hover:scale-110 hover:shadow-[0_12px_35px_rgba(79,70,229,0.5)] active:scale-95"
  aria-label="Open SportNest AI Assistant"
  title="Chat with SportNest AI"
>
  {isOpen ? (
    <svg
      className="h-7 w-7 transition-transform duration-300 group-hover:rotate-90"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M18 6 6 18M6 6l12 12" />
    </svg>
  ) : (
    <svg
      className="h-9 w-9 transition-transform duration-300 group-hover:scale-110"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 3a7 7 0 0 0-7 7v4a3 3 0 0 0 3 3h1" />
      <path d="M12 3a7 7 0 0 1 7 7v4a3 3 0 0 1-3 3h-1" />
      <rect x="8" y="8" width="8" height="9" rx="3" />
      <path d="M10.5 11.5h.01M13.5 11.5h.01M10.5 14.5h3" />
      <path d="m19 3 1 2 2 1-2 1-1 2-1-2-2-1 2-1z" />
    </svg>
  )}

  {!isOpen && (
    <>
      <span className="absolute -right-0.5 -top-0.5 h-4 w-4 rounded-full border-[3px] border-white bg-green-500" />
      <span className="absolute inset-0 rounded-full border border-blue-400/50 animate-ping opacity-30" />
    </>
  )}
</button>

    </>
  );
};

export default AIChat;
