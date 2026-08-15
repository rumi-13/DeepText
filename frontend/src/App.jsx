import { useState } from "react";
import "./App.css";

function App() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSend() {
    const text = message.trim();

    if (!text || loading) return;

    setMessages((previous) => [
      ...previous,
      {
        role: "user",
        content: text,
      },
    ]);

    setMessage("");
    setError("");
    setLoading(true);

    try {
      const response = await fetch("http://127.0.0.1:8000/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: text,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error: ${response.status}`);
      }

      const data = await response.json();

      setMessages((previous) => [
        ...previous,
        {
          role: "ai",
          content: data.response,
        },
      ]);
    } catch (err) {
      console.error(err);
      setError("Unable to connect to the AI server.");
    } finally {
      setLoading(false);
    }
  }

  function handleKeyDown(event) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSend();
    }
  }

  return (
    <div className="app">

      {/* Header */}
      <header className="header">
        <div className="header-content">

          <div className="brand">
            <div className="brand-logo">
              DT
            </div>

            <div>
              <h1>DeepText</h1>

              <div className="status">
                <span className="status-dot"></span>
                Online
              </div>
            </div>
          </div>

          <div className="model">
            DeepSeek
          </div>

        </div>
      </header>

      {/* Main */}
      <main className="main">

        {/* Chat */}
        <section className="chat">

          {messages.length === 0 ? (
            <div className="welcome">

              <div className="welcome-mark">
                DT
              </div>

              <h2>Hello.</h2>

              <p>
                Ready to ask something?
              </p>

            </div>
          ) : (
            <div className="messages">

              {messages.map((item, index) => (
                <div
                  key={index}
                  className={`message-row ${item.role}`}
                >
                  <div className={`message-bubble ${item.role}`}>

                    <span className="message-role">
                      {item.role === "user" ? "You" : "AI"}
                    </span>

                    <p>
                      {item.content}
                    </p>

                  </div>
                </div>
              ))}

              {loading && (
                <div className="message-row ai">
                  <div className="typing">

                    <span></span>
                    <span></span>
                    <span></span>

                  </div>
                </div>
              )}

            </div>
          )}

        </section>

        {/* Error */}
        {error && (
          <div className="error">
            {error}
          </div>
        )}

        {/* Composer */}
        <div className="composer">

          <input
            type="text"
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask something..."
            disabled={loading}
            autoComplete="off"
          />

          <button
            onClick={handleSend}
            disabled={loading || !message.trim()}
          >
            {loading ? "..." : "Send"}
          </button>

        </div>

        <p className="hint">
          Press Enter to send
        </p>

      </main>

    </div>
  );
}

export default App;