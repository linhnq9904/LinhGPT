import { useState } from "react";

type Props = {
    onSend: (
        message: string
    ) => void;
};

function ChatInput({
    onSend,
}: Props) {

    const [message, setMessage] =
        useState("");

    const handleSend = () => {

        if (!message.trim()) return;

        onSend(message);

        setMessage("");
    };

    return (
        <div className="border-t bg-white p-4">

            <div className="max-w-4xl mx-auto flex gap-3">

                <input
                    type="text"
                    value={message}
                    onChange={(e) =>
                        setMessage(e.target.value)
                    }
                    onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            handleSend();
                        }
                    }}
                    placeholder="Nhập câu hỏi..."
                    className="
            flex-1
            border
            rounded-lg
            px-4
            py-3
            outline-none
          "
                />

                <button
                    onClick={handleSend}
                    className="
            bg-black
            text-white
            px-6
            rounded-lg
          "
                >
                    Send
                </button>


            </div>

        </div>
    );
}

export default ChatInput;