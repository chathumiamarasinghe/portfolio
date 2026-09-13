"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { MessageCircle, Send, X } from "lucide-react";
import { site } from "@/data/site";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

const STORAGE_KEY = "portfolio-chat";
const MAX_MESSAGES = 10;

const welcome: ChatMessage = {
  role: "assistant",
  content: `Hi! I'm ${site.name}'s AI assistant. Ask me anything about skills, projects, or how to get in touch! 👋`,
};

function toChatHistory(messages: ChatMessage[]): ChatMessage[] {
  return messages.filter((message) => message.content !== welcome.content);
}

export function ChatWidget() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([welcome]);
  const [streaming, setStreaming] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);

  const visible = useMemo(() => !pathname.startsWith("/admin"), [pathname]);

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (!stored) return;
    try {
      const parsed = JSON.parse(stored) as ChatMessage[];
      if (Array.isArray(parsed) && parsed.length) setMessages(parsed);
    } catch {
      window.localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight });
  }, [messages]);

  if (!visible) return null;

  async function send() {
    const text = input.trim();
    if (!text || streaming) return;

    const nextMessages: ChatMessage[] = [
      ...messages,
      { role: "user", content: text },
    ];
    const chatHistory = toChatHistory(nextMessages);

    setMessages(nextMessages);
    setInput("");
    setStreaming(true);

    if (chatHistory.length > MAX_MESSAGES) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "Please use the contact form for longer conversations!",
        },
      ]);
      setStreaming(false);
      return;
    }

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: chatHistory }),
      });

      const contentType = response.headers.get("content-type") ?? "";
      if (!response.ok || !response.body || contentType.includes("application/json")) {
        const payload = contentType.includes("application/json")
          ? ((await response.json()) as { error?: string })
          : null;
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content:
              payload?.error ??
              "I couldn't reply just now. Try the contact form.",
          },
        ]);
        return;
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let assistantMessage = "";

      setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        assistantMessage += decoder.decode(value, { stream: true });
        setMessages((prev) => [
          ...prev.slice(0, -1),
          { role: "assistant", content: assistantMessage },
        ]);
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "I couldn't reply just now. Try the contact form.",
        },
      ]);
    } finally {
      setStreaming(false);
    }
  }

  return (
    <div className="fixed right-5 bottom-5 z-50">
      <AnimatePresence>
        {open ? (
          <motion.section
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 16 }}
            className="mb-3 flex h-[400px] w-[300px] flex-col overflow-hidden rounded-2xl border border-white/8 bg-[#111111] shadow-2xl"
            aria-label="Portfolio assistant"
          >
            <header className="flex items-center justify-between border-b border-white/8 px-4 py-3">
              <p className="text-sm font-medium">Ask {site.initials}</p>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close chat"
                className="text-text-muted hover:text-text-primary"
              >
                <X className="size-4" />
              </button>
            </header>
            <div ref={listRef} className="flex-1 space-y-3 overflow-y-auto px-3 py-3">
              {messages.map((message, index) => (
                <div
                  key={`${message.role}-${index}`}
                  className={`max-w-[85%] rounded-2xl px-3 py-2 text-sm leading-6 ${
                    message.role === "user"
                      ? "ml-auto bg-accent text-white"
                      : "bg-background text-text-primary"
                  }`}
                >
                  {message.content}
                </div>
              ))}
              {streaming && messages[messages.length - 1]?.content === "" ? (
                <div className="flex gap-1 px-2">
                  <span className="size-1.5 animate-bounce rounded-full bg-text-muted [animation-delay:-0.2s]" />
                  <span className="size-1.5 animate-bounce rounded-full bg-text-muted [animation-delay:-0.1s]" />
                  <span className="size-1.5 animate-bounce rounded-full bg-text-muted" />
                </div>
              ) : null}
            </div>
            <form
              className="flex gap-2 border-t border-white/8 p-3"
              onSubmit={(event) => {
                event.preventDefault();
                void send();
              }}
            >
              <input
                value={input}
                onChange={(event) => setInput(event.target.value)}
                placeholder="Ask a question..."
                className="h-9 flex-1 rounded-full border border-white/8 bg-background px-3 text-sm outline-none"
              />
              <button
                type="submit"
                aria-label="Send message"
                disabled={streaming}
                className="inline-flex size-9 items-center justify-center rounded-full bg-accent text-white disabled:opacity-50"
              >
                <Send className="size-3.5" />
              </button>
            </form>
          </motion.section>
        ) : null}
      </AnimatePresence>
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-label="Open chat"
        className="relative inline-flex size-14 items-center justify-center rounded-full bg-gradient-to-r from-accent to-accent-light text-white shadow-accent-glow"
      >
        <span className="absolute inset-0 animate-ping rounded-full bg-accent/30" />
        <MessageCircle className="relative size-5" />
      </button>
    </div>
  );
}
