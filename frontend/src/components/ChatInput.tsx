import { useState } from "react";
import { FiSend } from "react-icons/fi";

type Props = {
  onSend: (message: string) => void;
};

function ChatInput({ onSend }: Props) {
  const [message, setMessage] =
    useState("");

  const handleSend = () => {
    if (!message.trim()) return;

    onSend(message);
    setMessage("");
  };

  return (
    <div className="w-full">
      <div
        className="
          bg-white
          border
          border-gray-200
          rounded-3xl
          shadow-sm
          px-4
          py-3
          flex
          items-end
          gap-3
        "
      >
        <textarea
          rows={1}
          value={message}
          onChange={(e) =>
            setMessage(e.target.value)
          }
          onKeyDown={(e) => {
            if (
              e.key === "Enter" &&
              !e.shiftKey
            ) {
              e.preventDefault();
              handleSend();
            }
          }}
          placeholder="Hỏi bất kỳ điều gì"
          className="
            flex-1
            resize-none
            outline-none
            bg-transparent
            text-base
            max-h-40
          "
        />

        <button
          onClick={handleSend}
          disabled={!message.trim()}
          className="
            w-10
            h-10
            rounded-full
            bg-black
            text-white
            flex
            items-center
            justify-center
            disabled:bg-gray-300
          "
        >
          <FiSend size={18} />
        </button>
      </div>

    </div>
  );
}

export default ChatInput;