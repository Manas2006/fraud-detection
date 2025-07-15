export interface Message {
  id: number;
  userId: string;
  channel: 'EMAIL' | 'SMS' | 'CALL';
  text: string;
  riskScore: number;
  label: 'LOW' | 'MEDIUM' | 'HIGH';
  createdAt: string;
}

export interface ClassificationRequest {
  message: string;
  channel: 'EMAIL' | 'SMS' | 'CALL';
}

export interface ClassificationResponse {
  riskScore: number;
  label: 'LOW' | 'MEDIUM' | 'HIGH';
}

export interface MessageStats {
  userId: string;
  totalMessages: number;
  since: string;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
} 