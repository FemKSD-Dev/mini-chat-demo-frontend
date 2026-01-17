"use client";

import { useMemo, useState } from "react";
import type { ConversationItem, User } from "@/lib/types";

export function ConversationList({
  me,
  usersForNewChat,
  conversations,
  selectedId,
  onSelect,
  onCreate,
  onLoadMore,
  hasMore,
  loading,
  error,
}: {
  me: User | null;
  usersForNewChat: User[];
  conversations: ConversationItem[];
  selectedId: number | null;
  onSelect: (id: number) => void;

  onCreate: (participantId: number) => Promise<void>;
  onLoadMore: () => Promise<void>;
  hasMore: boolean;

  loading: boolean;
  error: string | null;
}) {
  const [participantId, setParticipantId] = useState<number | "">("");

  const sortedUsers = useMemo(
    () => usersForNewChat.slice().sort((a, b) => a.id - b.id),
    [usersForNewChat]
  );

  return (
    <div className="h-full flex flex-col bg-[var(--card-bg)]">
      {/* New conversation section */}
      <div className="p-4 border-b border-[var(--border)] bg-[var(--card-bg)] shadow-sm">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-semibold shadow-md">
            {me?.name.charAt(0).toUpperCase() ?? "?"}
          </div>
          <div>
            <div className="text-xs text-[var(--foreground)] opacity-60">Logged in as</div>
            <div className="font-semibold text-[var(--foreground)]">
              {me ? me.name : "—"}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <select
            className="flex-1 border border-[var(--border)] rounded-lg px-3 py-2 text-sm bg-[var(--background)] text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            value={participantId}
            onChange={(e) => setParticipantId(e.target.value ? Number(e.target.value) : "")}
          >
            <option value="">Start chat with…</option>
            {sortedUsers.map((u) => (
              <option key={u.id} value={u.id}>
                {u.name}
              </option>
            ))}
          </select>

          <button
            className="px-4 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-md hover:shadow-lg flex items-center gap-1.5"
            disabled={participantId === "" || loading}
            onClick={async () => {
              if (participantId === "") return;
              await onCreate(participantId);
            }}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <span>New</span>
          </button>
        </div>

        {error ? (
          <div className="mt-3 text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 p-2.5 rounded-lg">
            {error}
          </div>
        ) : null}
      </div>

      {/* Conversations list */}
      <div className="flex-1 overflow-auto">
        {conversations.length === 0 && !loading ? (
          <div className="flex flex-col items-center justify-center h-full p-6 text-center">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center mb-3 shadow-lg">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
              </svg>
            </div>
            <div className="text-sm font-medium text-[var(--foreground)] mb-1">No conversations yet</div>
            <div className="text-xs text-[var(--foreground)] opacity-60">Start a new chat to get started</div>
          </div>
        ) : null}

        <ul className="divide-y divide-[var(--border)]">
          {conversations.map((c) => {
            const active = c.id === selectedId;
            return (
              <li key={c.id}>
                <button
                  className={[
                    "w-full text-left p-4 hover:bg-[var(--background)] transition-all duration-200 group",
                    active ? "bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border-l-4 border-blue-500" : "",
                  ].join(" ")}
                  onClick={() => onSelect(c.id)}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center text-white font-semibold shadow-md group-hover:scale-110 transition-transform duration-200">
                      {c.participant.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <div className="font-semibold text-[var(--foreground)] group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                          {c.participant.name}
                        </div>
                        <div className="text-xs text-[var(--foreground)] opacity-50">
                          {c.lastMessageAt ? new Date(c.lastMessageAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ""}
                        </div>
                      </div>
                      <div className="text-sm text-[var(--foreground)] opacity-70 line-clamp-1">
                        {c.lastMessage?.body ?? "No messages yet"}
                      </div>
                    </div>
                  </div>
                </button>
              </li>
            );
          })}
        </ul>

        {conversations.length > 0 && (
          <div className="p-3">
            <button
              className="w-full border border-[var(--border)] rounded-lg py-2.5 text-sm bg-[var(--card-bg)] text-[var(--foreground)] disabled:opacity-50 hover:bg-[var(--primary)] hover:text-white hover:border-[var(--primary)] transition-all duration-200 font-medium shadow-sm"
              disabled={!hasMore || loading}
              onClick={onLoadMore}
            >
              {loading ? "Loading…" : hasMore ? "Load more" : "No more"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
