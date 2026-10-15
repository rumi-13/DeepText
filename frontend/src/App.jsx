import { useEffect, useRef, useState } from "react";
import "./App.css";

const API_BASE_URL = (
  import.meta.env.VITE_API_URL || "http://127.0.0.1:8000"
).replace(/\/+$/, "");

function App() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages, loading]);

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
      const response = await fetch(`${API_BASE_URL}/chat`, {
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
    <div className="fixed inset-0 flex h-dvh w-full flex-col overflow-hidden bg-[#F4F3F0] font-sans text-[#14171A]">
      {/* HEADER */}
      <header className="flex-none border-b border-black/10 bg-white/95 backdrop-blur-sm">
        <div className="mx-auto flex h-16 w-[min(860px,calc(100%-32px))] items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#F2B705] font-display text-[11px] font-bold text-[#14171A]">
              DT
            </div>

            <div>
              <h1 className="font-display text-[15px] font-bold leading-none tracking-tight">
                deeptext.
              </h1>

              <div className="mt-1 flex items-center gap-1.5 text-[10px] text-black/40">
                <span className="h-1.5 w-1.5 rounded-full bg-[#62c39a]" />
                Online
              </div>
            </div>
          </div>

          <div className="rounded-full border border-black/15 bg-white px-3 py-1.5 text-[10px] font-medium uppercase tracking-wide text-black/70">
            Groq
          </div>
        </div>
      </header>

      {/* CHAT */}
      <main className="mx-auto flex w-[min(720px,calc(100%-24px))] min-h-0 flex-1 flex-col py-3">
        <section className="min-h-0 flex-1 overflow-hidden rounded-2xl border border-black/10 bg-white">
          {messages.length === 0 ? (
            <div className="relative flex h-full w-full flex-col items-center justify-center overflow-hidden text-center">
              <div className="pointer-events-none absolute right-1/2 top-1/2 h-56 w-56 -translate-y-1/2 translate-x-24 rounded-full bg-[#F2B705]/80" />

              <div className="relative z-10 mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#14171A] font-display text-xs font-bold text-white shadow-sm">
                DT
              </div>

              <h2 className="relative z-10 font-display text-4xl font-bold tracking-tight">
                Hello.
              </h2>

              <div className="relative z-10 mt-3 flex items-center gap-3">
                <span className="h-4 w-px bg-black/25" />
                <p className="text-sm text-slate-800">
                  Ready to ask something?
                </p>
              </div>
            </div>
          ) : (
            <div className="messages-scroll flex h-full w-full flex-col gap-3.5 overflow-y-auto p-5">
              {messages.map((item, index) => (
                <div
                  key={index}
                  className={`flex animate-message-in ${
                    item.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[75%] wrap-break-word px-3.5 py-2.5  text-[13px] leading-relaxed ${
                      item.role === "user"
                        ? "rounded-2xl rounded-br-xl bg-[#14171A] text-white "
                        : "rounded-2xl rounded-bl-xl border border-[#F2B705]/25 bg-[#FFF9E6] text-[#14171A]"
                    }`}
                  >
                    <span
                      className={`mb-1 block text-[8px] font-bold uppercase tracking-[0.12em] ${
                        item.role === "user" ? "text-white/70" : "text-black/80"
                      }`}
                    >
                      {item.role === "user" ? "You" : "AI"}
                    </span>

                    <p className="m-0 font-semibold font-family: var(--font-sans); whitespace-pre-wrap">{item.content}</p>
                  </div>
                </div>
              ))}

              {loading && (
                <div className="flex justify-start">
                  <div className="flex w-fit items-center gap-1 rounded-2xl rounded-bl-md border border-black/10 bg-white px-4 py-3">
                    <span className="h-1.5 w-1.5 animate-typing-dot rounded-full bg-black/40" />
                    <span className="h-1.5 w-1.5 animate-typing-dot rounded-full bg-black/40 [animation-delay:0.15s]" />
                    <span className="h-1.5 w-1.5 animate-typing-dot rounded-full bg-black/40 [animation-delay:0.3s]" />
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>
          )}
        </section>

        {/* ERROR */}
        {error && (
          <div className="mt-1.5 flex-none rounded-lg bg-[#F5E5E5] px-3 py-2 text-[11px] text-[#743D3D]">
            {error}
          </div>
        )}

        {/* INPUT */}
        <div className="mt-2.5 flex flex-none items-center gap-1.5 rounded-2xl border border-black/15 bg-white p-1.5 shadow-sm transition-colors focus-within:border-black/40">
          <input
            type="text"
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask something..."
            disabled={loading}
            autoComplete="off"
            className="min-w-0 flex-1 bg-transparent px-3 py-2.5 text-[13px] text-[#14171A] outline-none placeholder:text-black/35"
          />

          <button
            onClick={handleSend}
            disabled={loading || !message.trim()}
            className="flex-none rounded-xl bg-[#14171A] px-4 py-2.5 text-xs font-semibold text-white transition-colors duration-150 hover:bg-[#F2B705] hover:text-[#14171A] disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-[#14171A] disabled:hover:text-white"
          >
            {loading ? "..." : "Send"}
          </button>
        </div>

        <p className="mt-1 flex-none text-center text-[9px] text-black/35">
          Press Enter to send
        </p>
      </main>
    </div>
  );
}

export default App;
