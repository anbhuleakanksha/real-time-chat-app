import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterOutlet } from '@angular/router';
import { ChatService, ChatEvent } from './chat.service';

import { BrowserModule } from '@angular/platform-browser';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,FormsModule,CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
    username = '';
  message = '';
  typingMessage: string = '';

  chatLog: ChatEvent[] = [];
  audio = new Audio('/assets/notify.mp3');
  joined = false;

  constructor(private chat: ChatService) {}

  ngOnInit() {
  this.chat.getMessages().subscribe(ev => {
    this.chatLog.push(ev);

    if (
      ev.type === 'message' &&
      ev.senderId !== 'bot' &&
      ev.username !== this.username
    ) {
      this.audio.play().catch(err =>
        console.warn('🔇 Audio play blocked:', err)
      );
    }
  });
}


  joinChat() {
  const trimmedName = this.username.trim();
  if (trimmedName.length >= 2) {
    this.username = trimmedName;
    this.chat.join(this.username);
    this.joined = true;

    // 🟢 Trigger audio load/play on first user interaction
    this.audio.load();
    this.audio.play().catch(() => {});
  }
}


  send() {
    if (this.message.trim()) {
      this.chat.sendMessage({
        message: this.message,
        username: this.username
      });
      this.message = '';
    }
  }

  isOwnMessage(ev: ChatEvent): boolean {
    return ev.username === this.username;
  }
  onInput() {
  this.chat.sendTypingStatus(this.username, true);
  setTimeout(() => this.chat.sendTypingStatus(this.username, false), 1000);
}

}
