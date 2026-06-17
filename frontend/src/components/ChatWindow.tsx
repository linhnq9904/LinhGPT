import Message from "./Message";
import { useEffect, useRef } from "react";
import type { Message as MessageType } from "../types/message";

type Props = {
  messages: MessageType[];
};

function ChatWindow({ messages }: Props) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);

  return (
    <div className="flex-1 overflow-y-auto p-6">
      <div className="max-w-4xl mx-auto">
        {messages.map((message, index) => (
          <Message
            key={index}
            role={message.role}
            content={message.content}
          />
        ))}

        <div ref={bottomRef}></div>
      </div>
    </div>
  );
}

export default ChatWindow;