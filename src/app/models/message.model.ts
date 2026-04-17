export interface Message {
  id: number;
  match_id: number;
  sender_id: number;
  content: string;
  created_at: string;
}

export interface SendMessageRequest {
  content: string;
}
