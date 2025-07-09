import { Injectable } from '@angular/core';
import { io } from 'socket.io-client';
import { Observable } from 'rxjs';

export interface ChatEvent {
  type: 'message' | 'notification' | 'typing';
  username?: string;
  message?: string;
  senderId?: string;
  timestamp?: string;
}

@Injectable({ providedIn: 'root' })
export class ChatService {
  private socket = io('http://localhost:3000');

  join(username: string) {
    this.socket.emit('join', username);
  }

  sendMessage(data: { message: string; username: string }) {
    this.socket.emit('chat message', {
      ...data,
      timestamp: new Date().toISOString()
    });
  }

  // ✅ Add this method to fix the error
  sendTypingStatus(username: string, typing: boolean) {
    this.socket.emit('typing', {
      type: 'typing',
      username,
      message: typing ? `${username} is typing...` : ''
    });
  }

  getMessages(): Observable<ChatEvent> {
    return new Observable(observer => {
      this.socket.on('chat message', (ev: ChatEvent) => observer.next(ev));
      this.socket.on('typing', (ev: ChatEvent) => observer.next(ev));
    });
  }
}
