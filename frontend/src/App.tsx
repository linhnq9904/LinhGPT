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
    <div className="h-screen flex bg-white text-gray-900">
      {/* Sidebar */}
      <aside className="w-[280px] bg-[#f9f9f9] border-r border-gray-200 flex flex-col">
        <div className="px-4 py-4 flex items-center justify-between">
          <h1 className="text-xl font-semibold">LinhGPT</h1>
          <button className="w-8 h-8 rounded-lg hover:bg-gray-200">
            ⌕
          </button>
        </div>

        <div className="px-3 space-y-1">
          <button
            onClick={handleNewChat}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-gray-200 text-left"
          >
            ✏️ <span>Đoạn chat mới</span>
          </button>

          <button className="w-full flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-gray-200 text-left">
            🔍 <span>Tìm kiếm đoạn chat</span>
          </button>

          <button className="w-full flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-gray-200 text-left">
            📚 <span>Thư viện</span>
          </button>

          <button className="w-full flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-gray-200 text-left">
            📁 <span>Dự án</span>
          </button>
        </div>

        <div className="px-4 mt-6 text-sm font-semibold text-gray-600">
          Gần đây
        </div>

        <div className="px-2 mt-2 flex-1 overflow-y-auto space-y-1">
          {[
            "Kế hoạch tạo ChatGPT Clone",
            "React là gì?",
            "PHP API Groq",
            "Streaming API",
            "Lưu chat vào MySQL",
          ].map((item, index) => (
            <div
              key={index}
              className={`px-3 py-2 rounded-xl cursor-pointer text-sm truncate ${index === 0
                  ? "bg-gray-200"
                  : "hover:bg-gray-200"
                }`}
            >
              {item}
            </div>
          ))}
        </div>

        <div className="border-t border-gray-200 p-3">
          <div className="flex items-center gap-3 px-2 py-2 rounded-xl hover:bg-gray-200 cursor-pointer">
            <div className="w-8 h-8 rounded-full bg-red-500 text-white flex items-center justify-center text-sm">
              LQ
            </div>
            <div>
              <div className="text-sm font-medium">Linh Quang</div>
              <div className="text-xs text-gray-500">Free</div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 flex flex-col relative">
        <header className="h-14 flex items-center justify-between px-5 border-b border-gray-100">
          <div className="text-lg font-semibold">LinhGPT</div>
          <button className="px-3 py-1.5 rounded-lg border border-gray-200 hover:bg-gray-100 text-sm">
            Chia sẻ
          </button>
        </header>

        <div className="flex-1 overflow-y-auto">
          <div className="max-w-3xl mx-auto px-4 py-8">
            {messages.length === 0 ? (
              <div className="min-h-[60vh] flex flex-col items-center justify-center">
                <h2 className="text-4xl font-semibold mb-8">
                  Tôi có thể giúp gì cho bạn?
                </h2>
              </div>
            ) : (
              <ChatWindow messages={messages} />
            )}
          </div>
        </div>

        {loading && (
          <div className="text-center text-sm text-gray-500 py-2">
            LinhGPT đang trả lời...
          </div>
        )}

        <div className="border-t bg-white p-4">
          <div className="max-w-3xl mx-auto">
            <ChatInput onSend={handleSend} />
          </div>
          <p className="text-center text-xs text-gray-400 mt-2">
            LinhGPT có thể mắc lỗi. Hãy kiểm tra các thông tin quan trọng.
          </p>
        </div>
      </main>
    </div>
  );
}

export default App;