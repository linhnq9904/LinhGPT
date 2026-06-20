import { useEffect, useState } from "react";
import ChatWindow from "./components/ChatWindow";
import ChatInput from "./components/ChatInput";
import type { Message } from "./types/message";
import { streamMessage } from "./services/chatStream";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";

function App() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [conversations, setConversations] = useState<any[]>([]);
  const [conversationId, setConversationId] = useState<number | null>(null);

  const [authPage, setAuthPage] =
    useState<"guest" | "login" | "register">("guest");

  const [token, setToken] = useState<string | null>(
    localStorage.getItem("token")
  );

  const [user, setUser] = useState<any>(
    JSON.parse(localStorage.getItem("user") || "null")
  );

  const loadConversations = async () => {
    const currentToken = localStorage.getItem("token");

    if (!currentToken) {
      setConversations([]);
      return;
    }

    const res = await fetch(
      "http://localhost/Backend/Api/get-conversations.php",
      {
        headers: {
          "X-Auth-Token": `Bearer ${currentToken}`,
        },
      }
    );

    const data = await res.json();

    if (Array.isArray(data)) {
      setConversations(data);
    } else {
      setConversations([]);
    }
  };

  useEffect(() => {
    if (token) {
      loadConversations();
    }
  }, [token]);

  const handleNewChat = async () => {
    if (!token) {
      setMessages([]);
      setConversationId(null);
      return;
    }

    const currentToken = localStorage.getItem("token");

    const res = await fetch(
      "http://localhost/Backend/Api/create-conversation.php",
      {
        method: "POST",
        headers: {
          "X-Auth-Token": `Bearer ${currentToken}`,
        },
      }
    );

    const data = await res.json();

    if (!data.success) {
      alert(data.message || "Không tạo được cuộc trò chuyện");
      return;
    }

    setConversationId(Number(data.conversation_id));
    setMessages([]);
    await loadConversations();
  };

  const loadConversation = async (id: number) => {
    if (!token) return;

    const currentToken = localStorage.getItem("token");

    setConversationId(id);

    const res = await fetch(
      `http://localhost/Backend/Api/get-messages.php?conversation_id=${id}`,
      {
        headers: {
          "X-Auth-Token": `Bearer ${currentToken}`,
        },
      }
    );

    const data = await res.json();

    if (Array.isArray(data)) {
      setMessages(data);
    } else {
      setMessages([]);
    }
  };

const handleSend = async (text: string) => {
  let currentConversationId = conversationId;
  const currentToken = localStorage.getItem("token");

  if (currentToken && !currentConversationId) {
    const res = await fetch(
      "http://localhost/Backend/Api/create-conversation.php",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Auth-Token": `Bearer ${currentToken}`,
        },
      }
    );

    const data = await res.json();

    if (!data.success) {
      alert(data.message || "Không tạo được cuộc trò chuyện");
      return;
    }

    currentConversationId = Number(data.conversation_id);
    setConversationId(currentConversationId);
  }

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
    await streamMessage(
      text,
      currentToken ? currentConversationId : null,
      (chunk) => {
        if (chunk.includes("[DONE]")) return;

        setMessages(prev => {
          const updated = [...prev];
          const lastIndex = updated.length - 1;

          updated[lastIndex] = {
            ...updated[lastIndex],
            content: updated[lastIndex].content + chunk,
          };

          return updated;
        });
      }
    );

    if (currentToken) {
      await loadConversations();
    }
  } catch (error) {
    console.error(error);
  } finally {
    setLoading(false);
  }
};
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setToken(null);
    setUser(null);
    setMessages([]);
    setConversations([]);
    setConversationId(null);
    setAuthPage("guest");
  };

  if (!token && authPage === "login") {
    return (
      <LoginPage
        onLogin={(newToken, newUser) => {
          localStorage.setItem("token", newToken);
          localStorage.setItem("user", JSON.stringify(newUser));
          setToken(newToken);
          setUser(newUser);
          setAuthPage("guest");
        }}
        onGoRegister={() => setAuthPage("register")}
      />
    );
  }

  if (!token && authPage === "register") {
    return (
      <RegisterPage
        onGoLogin={() => setAuthPage("login")}
      />
    );
  }

  return (
    <div className="h-screen flex bg-white text-gray-900">
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

        {token && (
          <>
            <div className="px-4 mt-6 text-sm font-semibold text-gray-600">
              Gần đây
            </div>

            <div className="px-2 mt-2 flex-1 overflow-y-auto space-y-1">
              {conversations.map((item) => (
                <div
                  key={item.id}
                  onClick={() => loadConversation(Number(item.id))}
                  className={`px-3 py-2 rounded-xl cursor-pointer text-sm truncate ${
                    conversationId === Number(item.id)
                      ? "bg-gray-200"
                      : "hover:bg-gray-200"
                  }`}
                >
                  {item.title || "Cuộc trò chuyện mới"}
                </div>
              ))}
            </div>
          </>
        )}

        {!token && (
          <div className="flex-1 px-4 mt-6 text-sm text-gray-500">
            Đăng nhập để lưu lịch sử trò chuyện.
          </div>
        )}

        <div className="border-t border-gray-200 p-3">
          {token ? (
            <div className="flex items-center gap-3 px-2 py-2 rounded-xl hover:bg-gray-200">
              <div className="w-8 h-8 rounded-full bg-red-500 text-white flex items-center justify-center text-sm">
                {user?.fullname?.charAt(0)?.toUpperCase() || "U"}
              </div>

              <div className="flex-1">
                <div className="text-sm font-medium">
                  {user?.fullname || "User"}
                </div>

                <button
                  onClick={handleLogout}
                  className="text-xs text-red-500"
                >
                  Đăng xuất
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setAuthPage("login")}
              className="w-full px-3 py-2 rounded-xl bg-black text-white text-sm"
            >
              Đăng nhập
            </button>
          )}
        </div>
      </aside>

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