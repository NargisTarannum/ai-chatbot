// Type definitions for chat messages
export interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  streaming?: boolean;
}

export interface ChatSession {
  id: string;
  title: string;
  messages: Message[];
  createdAt: Date;
  updatedAt: Date;
  userId: string;
}

export interface User {
  id: string;
  email: string;
  username: string;
  passwordHash: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface FileUpload {
  id: string;
  filename: string;
  mimetype: string;
  size: number;
  url: string;
  uploadedAt: Date;
  userId: string;
}

export interface GeminiResponse {
  text: string;
  error?: string;
}
