import React from 'react';
import { User, Bot } from 'lucide-react';
import { UISnippetRenderer } from './UISnippetRenderer';
import type { ChatMessage } from '../types/chat';

interface ChatMessageProps {
  message: ChatMessage;
}

export const ChatMessageComponent: React.FC<ChatMessageProps> = ({ message }) => {
  return (
    <div className={`chat-message flex gap-3 p-4 ${message.isUser ? 'bg-blue-50' : 'bg-white'}`}>
      <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
        message.isUser ? 'bg-blue-500' : 'bg-gray-500'
      }`}>
        {message.isUser ? (
          <User className="w-4 h-4 text-white" />
        ) : (
          <Bot className="w-4 h-4 text-white" />
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="font-medium text-sm">
            {message.isUser ? 'You' : 'AI Assistant'}
          </span>
          <span className="text-xs text-gray-500">
            {message.timestamp.toLocaleTimeString()}
          </span>
        </div>

        <div className="prose prose-sm max-w-none">
          <p className="text-gray-800 whitespace-pre-wrap">{message.content}</p>
        </div>

        {message.uiSnippet && (
          <div className="mt-4">
            <UISnippetRenderer snippet={message.uiSnippet} />
          </div>
        )}
      </div>
    </div>
  );
};
