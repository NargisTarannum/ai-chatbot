'use client';

import React from 'react';
import { Plus, Menu } from 'lucide-react';
import { useChatStore } from '@/store/chatStore';

export default function Sidebar() {
  const { sessions, createSession, setCurrentSession, deleteSession } =
    useChatStore();
  const [isOpen, setIsOpen] = React.useState(true);

  const handleNewChat = () => {
    const timestamp = new Date().toLocaleString();
    createSession(`Chat ${timestamp}`);
  };

  return (
    <>
      {/* Mobile Toggle */}
      <button
        className="fixed top-4 left-4 z-40 p-2 rounded-lg bg-secondary text-white lg:hidden"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Menu size={24} />
      </button>

      {/* Sidebar */}
      <div
        className={`${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } fixed left-0 top-0 h-full w-64 bg-primary text-white shadow-lg transition-transform duration-300 lg:translate-x-0 z-30`}
      >
        <div className="p-6 border-b border-gray-700">
          <button
            onClick={handleNewChat}
            className="w-full flex items-center justify-center gap-2 bg-secondary hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition"
          >
            <Plus size={20} />
            <span>New Chat</span>
          </button>
        </div>

        {/* Chat History */}
        <div className="flex-1 overflow-y-auto p-4">
          {sessions.length === 0 ? (
            <p className="text-gray-400 text-sm">No chats yet</p>
          ) : (
            <div className="space-y-2">
              {sessions.map((session) => (
                <div
                  key={session.id}
                  className="group flex items-center justify-between p-3 rounded-lg hover:bg-gray-700 cursor-pointer transition"
                  onClick={() => setCurrentSession(session.id)}
                >
                  <span className="text-sm truncate flex-1">{session.title}</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteSession(session.id);
                    }}
                    className="opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-300 transition"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 lg:hidden z-20"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}
