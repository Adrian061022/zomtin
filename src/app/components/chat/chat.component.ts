import { Component, OnInit, signal, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ChatService } from '../../services/chat.service';
import { AuthService } from '../../services/auth.service';
import { Message } from '../../models/message.model';
import { TimeAgoPipe } from '../../pipes/time-ago.pipe';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, TimeAgoPipe],
  template: `
    <div class="chat-page">
      <div class="chat-header">
        <a routerLink="/matches" class="back-btn">← Vissza</a>
        <h3>💬 Chat</h3>
      </div>

      <div class="messages-container" #messagesContainer>
        @if (loading()) {
          <div class="loading"><div class="spinner"></div></div>
        } @else if (messages().length === 0) {
          <div class="empty-chat">
            <p>Még nincs üzenet. Írj először! 🧟</p>
          </div>
        } @else {
          @for (msg of messages(); track msg.id) {
            <div class="message" [class.sent]="msg.sender_id === currentUserId()" [class.received]="msg.sender_id !== currentUserId()">
              <div class="bubble">
                <p>{{ msg.body }}</p>
                <span class="time">{{ msg.created_at | timeAgo }}</span>
              </div>
            </div>
          }
        }
      </div>

      <div class="chat-input">
        <input
          type="text"
          [(ngModel)]="newMessage"
          (keyup.enter)="sendMessage()"
          placeholder="Írj üzenetet... 🧠"
          [disabled]="sending()"
        >
        <button (click)="sendMessage()" [disabled]="!newMessage.trim() || sending()" class="send-btn">
          📨
        </button>
      </div>
    </div>
  `,
  styles: [`
    .chat-page {
      max-width: 600px;
      margin: 0 auto;
      display: flex;
      flex-direction: column;
      height: calc(100vh - 60px);
    }

    .chat-header {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 0.75rem 1rem;
      background: #16213e;
      border-bottom: 1px solid #2a2a4a;
    }

    .back-btn {
      color: #e94560;
      text-decoration: none;
      font-weight: 600;
    }

    .chat-header h3 { color: #fff; margin: 0; }

    .messages-container {
      flex: 1;
      overflow-y: auto;
      padding: 1rem;
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .loading { display: flex; justify-content: center; margin-top: 2rem; }
    .spinner {
      width: 36px; height: 36px;
      border: 3px solid #2a2a4a;
      border-top-color: #e94560;
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
    }
    @keyframes spin { to { transform: rotate(360deg); } }

    .empty-chat {
      text-align: center;
      color: #888;
      margin-top: 3rem;
    }

    .message {
      display: flex;
      max-width: 80%;
    }

    .message.sent {
      align-self: flex-end;
    }

    .message.received {
      align-self: flex-start;
    }

    .bubble {
      padding: 0.6rem 1rem;
      border-radius: 1rem;
      max-width: 100%;
    }

    .sent .bubble {
      background: #e94560;
      color: white;
      border-bottom-right-radius: 0.25rem;
    }

    .received .bubble {
      background: #1a2745;
      color: #ddd;
      border-bottom-left-radius: 0.25rem;
    }

    .bubble p { margin: 0; font-size: 0.95rem; line-height: 1.4; word-break: break-word; }
    .time { font-size: 0.7rem; opacity: 0.7; display: block; margin-top: 0.2rem; }

    .chat-input {
      display: flex;
      gap: 0.5rem;
      padding: 0.75rem 1rem;
      background: #16213e;
      border-top: 1px solid #2a2a4a;
    }

    .chat-input input {
      flex: 1;
      padding: 0.75rem 1rem;
      border: 2px solid #2a2a4a;
      border-radius: 2rem;
      background: #0f3460;
      color: #fff;
      font-size: 1rem;
      outline: none;
    }

    .chat-input input:focus { border-color: #e94560; }

    .send-btn {
      width: 48px;
      height: 48px;
      border: none;
      border-radius: 50%;
      background: #e94560;
      font-size: 1.3rem;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: background 0.2s;
      flex-shrink: 0;
    }

    .send-btn:hover:not(:disabled) { background: #c73550; }
    .send-btn:disabled { opacity: 0.5; cursor: not-allowed; }

    @media (max-width: 600px) {
      .chat-input input { font-size: 16px; }
    }
  `]
})
export class ChatComponent implements OnInit, AfterViewChecked {
  @ViewChild('messagesContainer') messagesContainer!: ElementRef;

  messages = signal<Message[]>([]);
  loading = signal(true);
  sending = signal(false);
  newMessage = '';
  matchId = 0;

  currentUserId = () => this.auth.currentUser()?.id ?? 0;

  constructor(
    private chatService: ChatService,
    private auth: AuthService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.matchId = Number(this.route.snapshot.paramMap.get('matchId'));
    this.loadMessages();
  }

  ngAfterViewChecked(): void {
    this.scrollToBottom();
  }

  loadMessages(): void {
    this.chatService.getMessages(this.matchId).subscribe({
      next: (msgs) => {
        this.messages.set(msgs);
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  sendMessage(): void {
    const body = this.newMessage.trim();
    if (!body) return;

    this.sending.set(true);
    this.chatService.sendMessage(this.matchId, { body }).subscribe({
      next: (msg) => {
        this.messages.update(msgs => [...msgs, msg]);
        this.newMessage = '';
        this.sending.set(false);
      },
      error: () => this.sending.set(false)
    });
  }

  private scrollToBottom(): void {
    try {
      this.messagesContainer.nativeElement.scrollTop = this.messagesContainer.nativeElement.scrollHeight;
    } catch {}
  }
}
