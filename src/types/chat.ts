export interface ChatMessage {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
  uiSnippet?: UISnippet;
}

export interface UISnippet {
  code: string;
  language: 'jsx' | 'tsx' | 'html' | 'css' | 'javascript' | 'typescript';
  description?: string;
  props?: Record<string, any>;
}

export interface OpenAIResponse {
  message: string;
  hasUISnippet: boolean;
  uiSnippet?: UISnippet;
}
