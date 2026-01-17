export type User = { id: number; name: string };

export type Cursor = { cursorAt: string; cursorId: number } | null;

export type ConversationItem = {
  id: number;
  participant: User;
  lastMessage: { id: number; body: string; senderId: number; createdAt: string } | null;
  lastMessageAt: string | null;
  updatedAt: string;
};

export type MessageItem = {
  id: number;
  conversationId: number;
  sender: User;
  body: string;
  createdAt: string;
};

export type Paged<T> = {
  items: T[];
  nextCursor: Cursor;
  hasMore: boolean;
};
