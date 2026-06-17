import { useState } from "react";

function App() {
  const [message, setMessage] = useState("");
  const [answer, setAnswer] = useState("");

  const sendMessage = async () => {
    const res = await fetch("http://localhost/Backend/Api/chat.php",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message }),
      })
  }
  return (
    <>
      <h1>LinhGPT</h1>
      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />

      <button onClick={sendMessage}>
        Send
      </button>

      <hr />

      <div>{answer}</div>
    </>
  );
}

export default App;
