import { useState } from "react";
import ChatWindow from "./components/ChatWindow";
import ChatInput from "./components/ChatInput";
import type { Message } from "./types/message";
import { streamMessage } from "./services/chatStream";

function App() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);

  const handleNewChat = () => {
    setMessages([]);
  };
  const handleSend = async (text: string) => {

    const userMessage: Message = {
      role: "user",
      content: text,
    };

    const assistantMessage: Message = {
      role: "assistant",
      content: "",
    };

    setMessages(prev => [
      ...prev,
      userMessage,
      assistantMessage,
    ]);
    setLoading(true);
    try {

      await streamMessage(text, (chunk) => {

        if (chunk.includes("[DONE]")) {
          return;
        }

        setMessages(prev => {

          const updated = [...prev];

          const lastIndex =
            updated.length - 1;

          updated[lastIndex] = {
            ...updated[lastIndex],
            content:
              updated[lastIndex].content +
              chunk,
          };

          return updated;
        });

      });

    } catch (error) {

      console.error(error);

    } finally {

      setLoading(false);

    }
  };

  return (
    <div className="h-screen flex flex-col bg-gray-100">
      <div className="bg-black text-white p-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">
          LinhGPT
        </h1>
        <button
          onClick={handleNewChat}
          className="bg-red-500 px-4 py-2 rounded hover:bg-red-600"
        >
          New Chat
        </button>
      </div>

      <ChatWindow messages={messages} />

      {loading && (
        <div className="text-center py-2">
          AI đang trả lời...
        </div>
      )}

      <ChatInput onSend={handleSend} />
    </div>
  );
}

export default App;