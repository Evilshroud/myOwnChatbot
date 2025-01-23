import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [chatHistory, setChatHistory] = useState([]);
  const [message, setMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const chatContainerRef = useRef(null);

  // Auto scroll to the bottom of the chat container
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatHistory]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    const userMessage = { type: "user", content: message };
    setChatHistory([...chatHistory, userMessage]);
    setMessage(""); // Clear input box

    setIsSending(true);
    try {
      // Make the API call to Flask backend
      const response = await axios.post("http://127.0.0.1:5000/chat", {
        message,
      });

      // The response from Flask is plain text now
      const botMessage = { type: "bot", content: response.data.reply };
      setChatHistory((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("Error sending message:", error);
      const errorMessage = { type: "bot", content: "Oops! Something went wrong." };
      setChatHistory((prev) => [...prev, errorMessage]);
    }
    setIsSending(false);
  };

  return (
    <div className="app-container">
      {/* Header */}
      <header className="header">
        <h1>My Own Chatbot 🤖</h1>
      </header>

      <main className="chat-container">
        {/* Chat Box */}
        <div
          ref={chatContainerRef}
          className="messages"
          style={{ maxHeight: "70vh", overflowY: "auto" }}
        >
          {chatHistory.length === 0 ? (
            <div className="welcome-message">
              <p>Welcome to My Own Chatbot! 👋</p>
              <p>Ask me anything to get started.</p>
            </div>
          ) : (
            chatHistory.map((msg, index) => (
              <div
                key={index}
                className={`message ${msg.type === "user" ? "user-message" : "bot-message"}`}
              >
                <div className="message-bubble">{msg.content}</div>
              </div>
            ))
          )}
        </div>

        {/* Input Form */}
        <form onSubmit={sendMessage} className="input-form">
          <input
            type="text"
            className="input"
            placeholder="Type your message here..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            disabled={isSending}
          />
          <button
            type="submit"
            className={`submit-button ${isSending ? "disabled" : ""}`}
            disabled={isSending}
          >
            {isSending ? "Sending..." : "Send"}
          </button>
        </form>
      </main>

      {/* Footer */}
      <footer className="footer">
        <p>&copy; 2025 My Own Chatbot. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default App;
