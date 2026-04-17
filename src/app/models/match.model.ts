import { User } from './user.model';

export interface Match {
  match_id: number;
  partner: User;
  created_at: string;
}

export interface SwipeAction {
  swiped_id: number;
  direction: 'like' | 'dislike';
}

export interface SwipeResponse {
  swipe: {
    id: number;
    swiper_id: number;
    swiped_id: number;
    direction: string;
  };
  match: {
    id: number;
    user_one_id: number;
    user_two_id: number;
  } | null;
}
