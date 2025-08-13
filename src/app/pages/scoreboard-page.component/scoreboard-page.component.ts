import { DecimalPipe } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-scoreboard-page.component',
  imports: [DecimalPipe, RouterLink],
  templateUrl: './scoreboard-page.component.html',
  styleUrl: './scoreboard-page.component.scss'
})
export class ScoreboardPageComponent {

  private router = inject(Router);

  private params = this.router.getCurrentNavigation()?.finalUrl?.queryParamMap;
  time: number = 0;
  total: number = 0;
  correct: number = 0;
  score: number = 0;
  wittyRemark: string = 'Initizalizing...';
  shareButtonText = signal('Share your Score');

  constructor() {
    if (this.params) {
      try {
        this.time = parseInt(this.params.get('time') ?? '0');
        this.total = parseInt(this.params.get('total') ?? '0');
        this.correct = parseInt(this.params.get('correct') ?? '0');
        this.score = (10000 - this.time) * (this.correct / this.total);
        this.wittyRemark = this.getWittyRemark();
      } catch (e) {
        this.wittyRemark = 'Someone has been playing with the params!';
        console.error(this.wittyRemark, e);
      }
    }
  }

  getWittyRemark(): string {
    const ratio = Math.round((this.correct / this.total) * 100) / 100;;

    if (this.time < 10 && ratio === 0) {
      return `Keep spamming random keys while I'm tracking you IP.`;
    }
    if (this.time < 10 && ratio === 0.25) {
      return 'Spamming the throw error button, uh?';
    }
    if (this.time <= 10 || this.correct >= this.total) {
      return 'Are you really cheating on an online anonymous test?';
    }
    if (this.time < 10 && ratio > 0.5 && ratio < 1) {
      return `You are cheating, but you aren't really good at it.`;
    }
    if (this.correct === 0) {
      return 'This is as hard as getting all the answers right, next time do the opposite.';
    }
    if (ratio < 0.25) {
      return 'Spamming the throw error button, is a better strategy for you.';
    }

    if (ratio === 0.5) {
      return ' fifty-fifty, not bad, not good either.';
    }
    if (ratio < 0.4 && this.time < 30) {
      return '2 fast 2 wrong.';
    }
    if (ratio > 0.8) {
      return `You should leave your girlfriend and start using Arch.`;
    }
    if (ratio > 0.8) {
      return `You should leave your girlfriend and start using Arch.`;
    }
    if (ratio === 0.92 && this.time === 54) {
      return `This was my score when I was testing this.`;
    }
    if (ratio === 1) {
      return `Why don't you just marry JSON if you like it so much?`;
    }
    if (this.time > 320) {
      return `next time send me an email and I will give you the answers, it will be faster.`;
    }
    return `I couldn't think a witty remark for your unremarkable score.`;
  }

  copyLinkToClipboard() {
    navigator.clipboard.writeText(window.location.origin + this.router.url).then(() => {
      this.shareButtonText.set('Link copied to clipboard!');
      console.log('Link copied to clipboard');
    }).catch(err => {
      console.error('Failed to copy link:', err);
    });
  }
}