
import { useState } from "react";
import API from "../services/api";

interface Message {
  role: "user" | "assistant";
  text: string;
}

const AIChat = () => {
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
    <div className="fixed bottom-6 right-6 z-50 w-[350px] max-w-[calc(100vw-32px)] overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl">

      <div className="bg-blue-700 p-4 text-white">
        <h2 className="text-lg font-bold">
          SportNest AI Assistant
        </h2>
        <p className="text-sm text-blue-100">
          Your sports shopping assistant
        </p>
      </div>

      <div className="flex h-80 flex-col gap-3 overflow-y-auto bg-gray-50 p-4">
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
          className="rounded-lg bg-blue-700 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Send
        </button>
      </form>

    </div>
  );
};

export default AIChat;
