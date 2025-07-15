import axios from 'axios';
import { Message, ClassificationRequest, ClassificationResponse, MessageStats } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor for authentication
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const messageApi = {
  // Classify text
  classifyText: async (request: ClassificationRequest): Promise<ClassificationResponse> => {
    const response = await api.post<ClassificationResponse>('/classify', request);
    return response.data;
  },

  // Get messages for user
  getMessages: async (
    userId: string,
    page: number = 0,
    size: number = 20,
    since?: string
  ): Promise<{ content: Message[]; totalElements: number; totalPages: number }> => {
    const params = new URLSearchParams({
      page: page.toString(),
      size: size.toString(),
    });
    
    if (since) {
      params.append('since', since);
    }
    
    const response = await api.get(`/messages/${userId}?${params}`);
    return response.data;
  },

  // Get message stats
  getMessageStats: async (userId: string, since?: string): Promise<MessageStats> => {
    const params = since ? `?since=${since}` : '';
    const response = await api.get<MessageStats>(`/messages/stats/${userId}${params}`);
    return response.data;
  },
};

export default api; 