import type { Cursor, ConversationItem, MessageItem, Paged, User } from "./types";
import { config } from "./config";

const baseUrl = `${config.apiBaseUrl}/api`;

type ApiErrorShape = { error?: { message?: string } };

async function parseJsonSafe(res: Response): Promise<unknown> {
  try {
    return await res.json();
  } catch {
    return null;
  }
}

export async function apiFetch<T>(
  path: string,
  userId: number,
  init?: RequestInit
): Promise<T> {
  const res = await fetch(`${baseUrl}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      "x-user-id": String(userId),
      ...(init?.headers ?? {}),
    },
    cache: "no-store",
  });

  const data = (await parseJsonSafe(res)) as ApiErrorShape | T | null;

  if (!res.ok) {
    const msg =
      (data as ApiErrorShape | null)?.error?.message ??
      `Request failed (${res.status})`;
    throw new Error(msg);
  }
  return data as T;
}

export function cursorToQuery(cursor: Cursor): string {
  if (!cursor) return "";
  const qs = new URLSearchParams({
    cursorAt: cursor.cursorAt,
    cursorId: String(cursor.cursorId),
  });
  return `&${qs.toString()}`;
}

// API calls
export async function getMe(userId: number) {
  const r = await apiFetch<{ user: User }>(`/users/me`, userId);
  return r.user;
}

export async function getUsers(userId: number, includeMe = false) {
  const r = await apiFetch<{ items: User[] }>(
    `/users${includeMe ? "?includeMe=1" : ""}`,
    userId
  );
  return r.items;
}

export async function listConversations(userId: number, limit: number, cursor: Cursor) {
  const query = `?limit=${limit}${cursorToQuery(cursor)}`;
  return apiFetch<Paged<ConversationItem>>(`/conversations${query}`, userId);
}

export async function createConversation(userId: number, participantId: number) {
  return apiFetch<{ conversation: ConversationItem }>(`/conversations`, userId, {
    method: "POST",
    body: JSON.stringify({ participantId }),
  });
}

export async function listMessages(
  userId: number,
  conversationId: number,
  limit: number,
  cursor: Cursor
) {
  const query = `?limit=${limit}${cursorToQuery(cursor)}`;
  return apiFetch<Paged<MessageItem>>(
    `/conversations/${conversationId}/messages${query}`,
    userId
  );
}

export async function sendMessage(userId: number, conversationId: number, body: string) {
  return apiFetch<{ message: MessageItem }>(`/messages`, userId, {
    method: "POST",
    body: JSON.stringify({ conversationId, body }),
  });
}
