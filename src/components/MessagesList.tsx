import React from 'react';
import { ChatMessageComponent } from './ChatMessage';
import type { ChatMessage } from '../types/chat';

interface MessagesListProps {
  messages: ChatMessage[];
  messagesEndRef: React.RefObject<HTMLDivElement | null>;
}

export const MessagesList: React.FC<MessagesListProps> = ({
  messages,
  messagesEndRef,
}) => {
  return (
    <div className="flex-1 overflow-y-auto bg-white">
      <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        {messages.map((message) => (
          <ChatMessageComponent key={message.id} message={message} />
        ))}
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
};
