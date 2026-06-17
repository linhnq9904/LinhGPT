type Props = {
  role: string;
  content: string;
};

function Message({ role, content }: Props) {
    const isUser = role === "user";
  return (
    <div  className={`mb-4 flex ${
        isUser
          ? "justify-end"
          : "justify-start"
      }`}>
         <div
        className={`max-w-[70%] p-4 rounded-xl ${
          isUser
            ? "bg-blue-500 text-white"
            : "bg-white border"
        }`}
      >
         <p>{content}</p>
      </div>
    </div>
  );
}
export default Message;