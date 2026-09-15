import { useEffect, useState, useRef } from "react";
import { supabase } from "../supabase/supabaseClient";
import { Send, X, MessageSquare } from "lucide-react";
import toast from "react-hot-toast";

export default function ChatDrawer({
  open,
  onClose,
  sessionId,
  currentUserId,
  otherUserName,
  otherUserId
}) {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Fetch initial message history
  useEffect(() => {
    if (!open || !sessionId) return;

    const fetchMessages = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from("messages")
          .select("*")
          .eq("session_id", sessionId)
          .order("created_at", { ascending: true });

        if (error) throw error;
        setMessages(data || []);
      } catch (err) {
        console.error("Error fetching messages:", err);
        toast.error("Could not load messages");
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, [open, sessionId]);

  // Realtime subscription
  useEffect(() => {
    if (!open || !sessionId) return;

    const channel = supabase
      .channel(`realtime-chat-${sessionId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `session_id=eq.${sessionId}`
        },
        (payload) => {
          setMessages((prev) => {
            if (prev.some((m) => m.id === payload.new.id)) return prev;
            return [...prev, payload.new];
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [open, sessionId]);

  // Scroll to bottom whenever messages update
  useEffect(() => {
    if (open) {
      scrollToBottom();
    }
  }, [messages, open]);

  // Send message
  const handleSend = async (e) => {
    e?.preventDefault();
    if (!text.trim() || !sessionId || !currentUserId || !otherUserId) return;

    const messageContent = text.trim();
    setText("");

    try {
      const { error } = await supabase.from("messages").insert([
        {
          session_id: sessionId,
          sender_id: currentUserId,
          receiver_id: otherUserId,
          content: messageContent
        }
      ]);

      if (error) {
        throw error;
      }
    } catch (err) {
      console.error("Error sending message:", err);
      toast.error("Failed to send message");
      setText(messageContent); // restore message on failure
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-end z-50 animate-fade-in">
      <div className="w-full max-w-md bg-slate-900 text-white h-full flex flex-col shadow-2xl border-l border-slate-800">
        
        {/* Header */}
        <div className="p-4 border-b border-slate-800 bg-slate-800/60 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center font-semibold text-lg text-white">
              {otherUserName?.trim().charAt(0)?.toUpperCase() || "U"}
            </div>
            <div>
              <h3 className="font-semibold text-base leading-tight">
                {otherUserName || "Participant"}
              </h3>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span className="text-xs text-slate-400">Realtime Session</span>
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700 transition"
          >
            <X size={20} />
          </button>
        </div>

        {/* Messages List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-950/40">
          {loading ? (
            <div className="flex items-center justify-center h-full text-slate-400 text-sm">
              Loading conversation...
            </div>
          ) : messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center px-4 text-slate-500">
              <MessageSquare size={36} className="mb-2 opacity-40" />
              <p className="font-medium text-sm text-slate-400">No messages yet</p>
              <p className="text-xs mt-1">
                Start your 1-on-1 discussion about your career goals!
              </p>
            </div>
          ) : (
            messages.map((m) => {
              const isMe = m.sender_id === currentUserId;
              return (
                <div
                  key={m.id}
                  className={`flex flex-col ${isMe ? "items-end" : "items-start"}`}
                >
                  <div
                    className={`max-w-[78%] px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed ${
                      isMe
                        ? "bg-slate-700 text-white rounded-br-xs"
                        : "bg-slate-800 text-slate-100 border border-slate-700/60 rounded-bl-xs"
                    }`}
                  >
                    {m.content}
                  </div>
                  <span className="text-[10px] text-slate-500 mt-1 px-1">
                    {m.created_at
                      ? new Date(m.created_at).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit"
                        })
                      : ""}
                  </span>
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <form
          onSubmit={handleSend}
          className="p-3 border-t border-slate-800 bg-slate-900 flex items-center gap-2"
        >
          <input
            type="text"
            placeholder="Type a message..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-slate-600 placeholder:text-slate-500"
          />
          <button
            type="submit"
            disabled={!text.trim()}
            className="p-2.5 rounded-xl bg-slate-700 text-white hover:bg-slate-600 disabled:opacity-40 disabled:cursor-not-allowed transition cursor-pointer"
          >
            <Send size={18} />
          </button>
        </form>

      </div>
    </div>
  );
}
