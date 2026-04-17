import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../models/user.model';
import { SwipeAction, SwipeResponse, Match } from '../models/match.model';

@Injectable({ providedIn: 'root' })
export class MatchService {
  private readonly apiUrl = 'http://localhost:8000/api';

  constructor(private http: HttpClient) {}

  /** Get candidates for swiping */
  getCandidates(): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/candidates`);
  }

  /** Swipe on a user */
  swipe(action: SwipeAction): Observable<SwipeResponse> {
    return this.http.post<SwipeResponse>(`${this.apiUrl}/swipe`, action);
  }

  /** Get all matches */
  getMatches(): Observable<Match[]> {
    return this.http.get<Match[]>(`${this.apiUrl}/matches`);
  }
}
