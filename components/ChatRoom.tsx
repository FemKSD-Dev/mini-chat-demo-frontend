"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { Cursor, MessageItem, User } from "@/lib/types";

export function ChatRoom({
  me,
  participant,
  conversationId,
  messages,
  hasMore,
  loading,
  error,
  onLoadOlder,
  onSend,
  onTypingChange,
  pollEnabled,
}: {
  me: User | null;
  participant: User | null;
  conversationId: number | null;

  messages: MessageItem[]; // we will keep newest-first in state, but render reversed
  hasMore: boolean;
  loading: boolean;
  error: string | null;

  onLoadOlder: () => Promise<void>;
  onSend: (text: string) => Promise<void>;
  onTypingChange?: (isTyping: boolean) => void;

  pollEnabled: boolean;
}) {
  const [text, setText] = useState("");
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const typingTimeoutRef = useRef<number | null>(null);
  const previousMessagesLengthRef = useRef<number>(0);
  const previousScrollHeightRef = useRef<number>(0);
  const isLoadingOlderRef = useRef<boolean>(false);

  const renderMessages = useMemo(() => {
    // render oldest->newest
    return messages.slice().reverse();
  }, [messages]);

  // Scroll to bottom when switching conversation
  useEffect(() => {
    if (conversationId) {
      // Reset refs when conversation changes
      previousMessagesLengthRef.current = 0;
      previousScrollHeightRef.current = 0;
      isLoadingOlderRef.current = false;
      
      // Scroll to bottom immediately
      setTimeout(() => {
        const el = scrollRef.current;
        if (el) {
          el.scrollTop = el.scrollHeight;
        }
      }, 0);
    }
  }, [conversationId]);

  // Handle scroll position when messages change
  useEffect(() => {
    const el = scrollRef.current;
    if (!el || messages.length === 0) return;

    const currentLength = messages.length;
    const previousLength = previousMessagesLengthRef.current;

    // First load or conversation just opened
    if (previousLength === 0) {
      previousMessagesLengthRef.current = currentLength;
      setTimeout(() => {
        if (el) {
          previousScrollHeightRef.current = el.scrollHeight;
          el.scrollTop = el.scrollHeight;
        }
      }, 0);
      return;
    }

    // Messages increased (either new messages or loaded older messages)
    if (currentLength > previousLength) {
      setTimeout(() => {
        if (!el) return;
        
        const previousScrollHeight = previousScrollHeightRef.current;
        const previousScrollTop = el.scrollTop;
        const currentScrollHeight = el.scrollHeight;
        const scrollHeightDiff = currentScrollHeight - previousScrollHeight;

        // Check if user was near bottom before update (within 150px)
        const wasNearBottom = previousScrollTop + el.clientHeight >= previousScrollHeight - 150;

        // If messages were added at the top (older messages loaded)
        // and user was NOT near bottom, maintain scroll position
        if (scrollHeightDiff > 0 && !wasNearBottom) {
          // Keep the same visual position by adjusting scrollTop
          el.scrollTop = previousScrollTop + scrollHeightDiff;
        } 
        // If user was near bottom (new messages arrived), scroll to bottom
        else if (wasNearBottom) {
          el.scrollTop = currentScrollHeight;
        }

        // Update refs
        previousScrollHeightRef.current = currentScrollHeight;
      }, 0);
    }

    // Update message count
    previousMessagesLengthRef.current = currentLength;
  }, [messages.length]);

  // Handle typing indicator
  const handleTextChange = (newText: string) => {
    setText(newText);
    
    // Notify parent that user is typing
    if (onTypingChange) {
      onTypingChange(newText.length > 0);
      
      // Clear existing timeout
      if (typingTimeoutRef.current) {
        window.clearTimeout(typingTimeoutRef.current);
      }
      
      // Set timeout to mark as not typing after 1 second of inactivity
      if (newText.length > 0) {
        typingTimeoutRef.current = window.setTimeout(() => {
          onTypingChange(false);
        }, 1000);
      }
    }
  };

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        window.clearTimeout(typingTimeoutRef.current);
      }
    };
  }, []);

  return (
    <div className="h-full min-h-0 flex flex-col bg-[var(--background)]">
      {/* Header */}
      <div className="p-4 border-b border-[var(--border)] bg-[var(--card-bg)] flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
          {participant && (
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-semibold shadow-md">
              {participant.name.charAt(0).toUpperCase()}
            </div>
          )}
          <div>
            <div className="text-xs text-[var(--foreground)] opacity-60">Chat with</div>
            <div className="font-semibold text-[var(--foreground)]">
              {conversationId
                ? participant
                  ? participant.name
                  : `Conversation #${conversationId}`
                : "Select a conversation"}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {pollEnabled && conversationId && (
            <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-green-500/10 text-green-600 dark:text-green-400 text-xs">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
              <span>Live</span>
            </div>
          )}
        </div>
      </div>

      {/* Messages area */}
      <div ref={scrollRef} className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden p-4">
        {conversationId ? (
          <div className="flex flex-col gap-3">
            <button
              className="w-full border border-[var(--border)] rounded-lg py-2.5 text-sm bg-[var(--card-bg)] text-[var(--foreground)] disabled:opacity-50 hover:bg-[var(--primary)] hover:text-white hover:border-[var(--primary)] transition-all duration-200 font-medium shadow-sm"
              disabled={!hasMore || loading}
              onClick={onLoadOlder}
            >
              {loading ? "Loading…" : hasMore ? "Load older messages" : "No older messages"}
            </button>

            {error ? (
              <div className="text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 p-3 rounded-lg">
                {error}
              </div>
            ) : null}

            <div className="flex flex-col gap-3">
              {renderMessages.map((m) => {
                const isMe = me ? m.sender.id === me.id : false;
                const senderInitial = m.sender.name ? m.sender.name.charAt(0).toUpperCase() : '?';
                
                // Debug log (remove in production)
                if (process.env.NODE_ENV === 'development') {
                  console.log(`Message ${m.id}: sender=${m.sender.id} (${m.sender.name}), me=${me?.id} (${me?.name}), isMe=${isMe}`);
                }
                
                return (
                  <div
                    key={m.id}
                    className={`flex items-end gap-2 w-full ${isMe ? 'justify-end' : 'justify-start'}`}
                  >
                    {/* Avatar for other users (left side) */}
                    {!isMe && (
                      <div className="w-8 h-8 min-w-[2rem] rounded-full bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center text-white text-xs font-semibold shadow-md">
                        {senderInitial}
                      </div>
                    )}
                    
                    {/* Message bubble */}
                    <div
                      className={`max-w-[70%] min-w-[100px] rounded-2xl px-4 py-2.5 shadow-lg break-words ${
                        isMe
                          ? 'bg-gradient-to-br from-blue-600 to-purple-600 text-white rounded-br-md'
                          : 'bg-[var(--card-bg)] text-[var(--foreground)] border border-[var(--border)] rounded-bl-md'
                      }`}
                    >
                      <div className={`text-xs font-medium mb-1 ${
                        isMe ? 'text-white/80' : 'text-[var(--foreground)] opacity-60'
                      }`}>
                        {m.sender.name} • {new Date(m.createdAt).toLocaleTimeString()}
                      </div>
                      <div className="text-sm whitespace-pre-wrap break-words leading-relaxed overflow-wrap-anywhere">
                        {m.body}
                      </div>
                    </div>
                    
                    {/* Avatar for current user (right side) */}
                    {isMe && (
                      <div className="w-8 h-8 min-w-[2rem] rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-xs font-semibold shadow-md">
                        {senderInitial}
                      </div>
                    )}
                  </div>
                );
              })}
              <div ref={bottomRef} />
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center mb-4 shadow-xl">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <div className="text-lg font-semibold text-[var(--foreground)] mb-2">No conversation selected</div>
            <div className="text-sm text-[var(--foreground)] opacity-60">Pick a conversation from the left to start chatting</div>
          </div>
        )}
      </div>

      {/* Input area */}
      <div className="p-4 border-t border-[var(--border)] bg-[var(--card-bg)] shadow-lg">
        <form
          className="flex items-center gap-3"
          onSubmit={async (e) => {
            e.preventDefault();
            const t = text.trim();
            if (!t) return;
            await onSend(t);
            setText("");
          }}
        >
          <input
            className="flex-1 border border-[var(--border)] rounded-xl px-4 py-3 text-sm bg-[var(--background)] text-[var(--foreground)] placeholder:text-[var(--foreground)] placeholder:opacity-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 disabled:opacity-50"
            placeholder={conversationId ? "Type a message…" : "Select a conversation first"}
            value={text}
            onChange={(e) => handleTextChange(e.target.value)}
            disabled={!conversationId || loading}
          />
          <button
            className="px-5 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl flex items-center gap-2"
            type="submit"
            disabled={!conversationId || loading || text.trim().length === 0}
          >
            <span>Send</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </form>
      </div>
    </div>
  );
}
