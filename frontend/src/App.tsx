import { useState } from "react";
import ChatWindow from "./components/ChatWindow";
import ChatInput from "./components/ChatInput";
import { sendMessage } from "./services/chatApi";
import type { Message } from "./types/message";

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
   
    setMessages(prev => [...prev, userMessage]);

    setLoading(true);

    try {
      const data = await sendMessage(text);

      const aiMessage: Message = {
        role: "assistant",
        content:
          data.candidates?.[0]?.content?.parts?.[0]?.text ||
          "Không có phản hồi",
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error(error);
    }

    setLoading(false);
  };

  return (
    <div className="h-screen flex flex-col bg-gray-100">
      <div className="bg-black text-white p-4">
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