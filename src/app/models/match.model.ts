export interface Match {
  id: number;
  user: {
    id: number;
    name: string;
    profile_image: string;
    type: 'zombie' | 'survivor';
  };
  matched_at: string;
  last_message?: string;
}

export interface SwipeAction {
  target_user_id: number;
  action: 'like' | 'dislike' | 'eat'; // "eat" is zombie special
}

export interface SwipeResponse {
  match: boolean;
  match_id?: number;
  message?: string;
}
