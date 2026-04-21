export interface Message {
  id: number;
  match_id: number;
  sender_id: number;
  body: string;
  created_at: string;
  sender?: {
    id: number;
    name: string;
  };
}

export interface SendMessageRequest {
  body: string;
}
