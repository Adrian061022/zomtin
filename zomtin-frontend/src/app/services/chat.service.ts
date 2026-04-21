import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Message, SendMessageRequest } from '../models/message.model';

@Injectable({ providedIn: 'root' })
export class ChatService {
  private readonly apiUrl = 'http://10.1.47.5:8000/api';

  constructor(private http: HttpClient) {}

  getMessages(matchId: number): Observable<Message[]> {
    return this.http.get<Message[]>(`${this.apiUrl}/matches/${matchId}/messages`);
  }

  sendMessage(matchId: number, data: SendMessageRequest): Observable<Message> {
    return this.http.post<Message>(`${this.apiUrl}/matches/${matchId}/messages`, data);
  }
}
