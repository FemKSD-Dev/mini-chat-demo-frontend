"use client";

import type { User } from "@/lib/types";

export function UserSwitcher({
  users,
  userId,
  onChange,
  disabled,
}: {
  users: User[];
  userId: number;
  onChange: (id: number) => void;
  disabled?: boolean;
}) {
  return (
    <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2 shadow-md">
      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
      <span className="text-sm text-white font-medium">Switch user:</span>
      <select
        className="border-0 rounded-md px-3 py-1.5 text-sm bg-white text-gray-900 font-medium disabled:opacity-60 focus:outline-none focus:ring-2 focus:ring-white/50 cursor-pointer transition-all duration-200"
        value={userId}
        onChange={(e) => onChange(Number(e.target.value))}
        disabled={disabled}
      >
        {users.map((u) => (
          <option key={u.id} value={u.id}>
            {u.name}
          </option>
        ))}
      </select>
    </div>
  );
}
