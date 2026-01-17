"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { Cursor, ConversationItem, MessageItem, User } from "@/lib/types";
import {
  createConversation,
  getMe,
  getUsers,
  listConversations,
  listMessages,
  sendMessage,
} from "@/lib/api";
import { config } from "@/lib/config";
import { UserSwitcher } from "@/components/UserSwitcher";
import { ConversationList } from "@/components/ConversationList";
import { ChatRoom } from "@/components/ChatRoom";

const LS_USER_ID = "demo_user_id";

function loadSavedUserId(): number {
  if (typeof window === "undefined") return 1;
  const v = window.localStorage.getItem(LS_USER_ID);
  const n = v ? Number(v) : 1;
  return Number.isInteger(n) && n > 0 ? n : 1;
}

export default function HomePage() {
  // Current user
  const [userId, setUserId] = useState<number>(1);
  const [me, setMe] = useState<User | null>(null);

  // Users list for switcher + create chat
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [usersForNewChat, setUsersForNewChat] = useState<User[]>([]);

  // Conversations pagination
  const [conversations, setConversations] = useState<ConversationItem[]>([]);
  const [convCursor, setConvCursor] = useState<Cursor>(null);
  const [convHasMore, setConvHasMore] = useState<boolean>(false);

  // Selected conversation + messages pagination
  const [selectedConversationId, setSelectedConversationId] = useState<number | null>(null);
  const [selectedParticipant, setSelectedParticipant] = useState<User | null>(null);

  const [messages, setMessages] = useState<MessageItem[]>([]); // newest-first
  const [msgCursor, setMsgCursor] = useState<Cursor>(null);
  const [msgHasMore, setMsgHasMore] = useState<boolean>(false);

  // Loading/error
  const [loadingLeft, setLoadingLeft] = useState(false);
  const [errorLeft, setErrorLeft] = useState<string | null>(null);

  const [loadingRight, setLoadingRight] = useState(false);
  const [errorRight, setErrorRight] = useState<string | null>(null);

  // polling control
  const pollRef = useRef<number | null>(null);
  const isTypingRef = useRef<boolean>(false);

  // Init userId from localStorage
  useEffect(() => {
    const saved = loadSavedUserId();
    setUserId(saved);
  }, []);

  // Persist userId
  useEffect(() => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem(LS_USER_ID, String(userId));
    }
  }, [userId]);

  async function refreshMeAndUsers(targetUserId: number) {
    const [meRes, usersRes] = await Promise.all([
      getMe(targetUserId),
      getUsers(targetUserId, true),
    ]);
    setMe(meRes);
    setAllUsers(usersRes);
    setUsersForNewChat(usersRes.filter((u) => u.id !== meRes.id));
  }

  async function refreshConversations(reset = true) {
    setErrorLeft(null);
    setLoadingLeft(true);
    try {
      const res = await listConversations(userId, 20, reset ? null : convCursor);
      setConvHasMore(res.hasMore);
      setConvCursor(res.nextCursor);
      setConversations((prev) => (reset ? res.items : [...prev, ...res.items]));
    } catch (e: unknown) {
      setErrorLeft((e as Error)?.message ?? "Failed to load conversations");
    } finally {
      setLoadingLeft(false);
    }
  }

  async function loadMessagesForConversation(conversationId: number, reset = true) {
    setErrorRight(null);
    setLoadingRight(true);
    try {
      const res = await listMessages(userId, conversationId, 30, reset ? null : msgCursor);
      setMsgHasMore(res.hasMore);
      setMsgCursor(res.nextCursor);
      setMessages((prev) => (reset ? res.items : [...prev, ...res.items])); // newest-first pages appended
    } catch (e: unknown) {
      setErrorRight((e as Error)?.message ?? "Failed to load messages");
    } finally {
      setLoadingRight(false);
    }
  }

  // When userId changes: reset app state, refetch
  useEffect(() => {
    let cancelled = false;

    async function run() {
      try {
        setLoadingLeft(true);
        setErrorLeft(null);
        setSelectedConversationId(null);
        setSelectedParticipant(null);

        setConversations([]);
        setConvCursor(null);
        setConvHasMore(false);

        setMessages([]);
        setMsgCursor(null);
        setMsgHasMore(false);

        await refreshMeAndUsers(userId);
        if (!cancelled) await refreshConversations(true);
      } catch (e: unknown) {
        if (!cancelled) setErrorLeft((e as Error)?.message ?? "Failed to init");
      } finally {
        if (!cancelled) setLoadingLeft(false);
      }
    }

    run();

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  // When selecting a conversation: load messages + derive participant from conversation list
  useEffect(() => {
    if (!selectedConversationId) return;
    const convo = conversations.find((c) => c.id === selectedConversationId);
    setSelectedParticipant(convo?.participant ?? null);

    setMessages([]);
    setMsgCursor(null);
    setMsgHasMore(false);

    loadMessagesForConversation(selectedConversationId, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedConversationId]);

  // Poll messages only for selected conversation (skip if typing)
  // Polling interval can be configured via NEXT_PUBLIC_POLLING_INTERVAL env variable
  useEffect(() => {
    if (pollRef.current) {
      window.clearInterval(pollRef.current);
      pollRef.current = null;
    }

    if (!selectedConversationId) return;

    pollRef.current = window.setInterval(async () => {
      // Skip polling if user is typing to avoid interruption
      if (isTypingRef.current) return;
      
      // Refresh latest page only (reset) to keep it simple and correct for demo
      await loadMessagesForConversation(selectedConversationId, true);
      // Also refresh conversations so left list updates last message/order
      await refreshConversations(true);
    }, config.pollingInterval);

    return () => {
      if (pollRef.current) {
        window.clearInterval(pollRef.current);
        pollRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedConversationId, userId]);

  const switcherUsers = useMemo(() => allUsers, [allUsers]);

  return (
    <div className="h-screen bg-[var(--background)]">
      <div className="h-full flex flex-col">
        {/* Top bar with gradient */}
        <header className="h-16 border-b border-[var(--border)] bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 dark:from-blue-500 dark:via-purple-500 dark:to-cyan-500 flex items-center justify-between px-6 shadow-lg">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <div>
              <div className="font-bold text-white text-lg">Mini Chat</div>
              <div className="text-xs text-white/80">Real-time messaging</div>
            </div>
          </div>
          <UserSwitcher
            users={switcherUsers.length ? switcherUsers : [{ id: userId, name: "User" }]}
            userId={userId}
            onChange={(id) => setUserId(id)}
            disabled={loadingLeft}
          />
        </header>

        {/* Main */}
        <main className="flex-1 grid grid-cols-12 overflow-hidden">
          {/* Left */}
          <aside className="col-span-4 border-r border-[var(--border)] h-full bg-[var(--card-bg)]">
            <ConversationList
              me={me}
              usersForNewChat={usersForNewChat}
              conversations={conversations}
              selectedId={selectedConversationId}
              onSelect={(id) => setSelectedConversationId(id)}
              onCreate={async (participantId) => {
                setErrorLeft(null);
                setLoadingLeft(true);
                try {
                  const res = await createConversation(userId, participantId);
                  // Refresh list and auto-select
                  await refreshConversations(true);
                  setSelectedConversationId(res.conversation.id);
                } catch (e: unknown) {
                  setErrorLeft((e as Error)?.message ?? "Failed to create conversation");
                } finally {
                  setLoadingLeft(false);
                }
              }}
              onLoadMore={async () => {
                if (!convHasMore) return;
                await refreshConversations(false);
              }}
              hasMore={convHasMore}
              loading={loadingLeft}
              error={errorLeft}
            />
          </aside>

          {/* Right */}
          <section className="col-span-8 h-full bg-[var(--background)] min-h-0">
            <ChatRoom
              me={me}
              participant={selectedParticipant}
              conversationId={selectedConversationId}
              messages={messages}
              hasMore={msgHasMore}
              loading={loadingRight}
              error={errorRight}
              onLoadOlder={async () => {
                if (!selectedConversationId || !msgHasMore) return;
                await loadMessagesForConversation(selectedConversationId, false);
              }}
              onSend={async (text) => {
                if (!selectedConversationId) return;
                setErrorRight(null);
                setLoadingRight(true);
                isTypingRef.current = false; // Reset typing state when sending
                try {
                  await sendMessage(userId, selectedConversationId, text);
                  await loadMessagesForConversation(selectedConversationId, true);
                  await refreshConversations(true);
                } catch (e: unknown) {
                  setErrorRight((e as Error)?.message ?? "Failed to send message");
                } finally {
                  setLoadingRight(false);
                }
              }}
              onTypingChange={(isTyping) => {
                isTypingRef.current = isTyping;
              }}
              pollEnabled={true}
            />
          </section>
        </main>
      </div>
    </div>
  );
}
