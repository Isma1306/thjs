import { AsyncPipe } from '@angular/common';
import { Component, ElementRef, inject, ViewChild, viewChild } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { filter, fromEvent } from 'rxjs';
import { GameService } from '../../services/game.service';

@Component({
  selector: 'app-game-page.component',
  imports: [ReactiveFormsModule, AsyncPipe],
  templateUrl: './game-page.component.html',
  styleUrl: './game-page.component.scss'
})
export class GamePageComponent {
  public form = new FormGroup({ input: new FormControl<string>('') });
  @ViewChild('input') input!: ElementRef<HTMLInputElement>;
  pressEnter$ = fromEvent<KeyboardEvent>(document, 'keydown')
    .pipe(
      filter(event => event.key === 'Enter'));

  gameService = inject(GameService);

  constructor() {
    this.pressEnter$.pipe(takeUntilDestroyed()).subscribe(() => this.submit());
    this.gameService.status$.pipe(takeUntilDestroyed()).subscribe(status => {
      if (!status) this.form.get('input')?.disable();
      else this.form.get('input')?.enable();
    });
  }

  start() {
    this.gameService.start();
    console.log(`Don't worry I changed the JSON object to avoid distractions.`);
    JSON.parse = () => {
      console.warn('NOPE!');
      return {};
    };
    JSON.stringify = () => {
      console.warn('NOPE!');
      return 'NOPE!';
    };
  }
  submit() {
    const text = this.form.get('input')?.value;
    if (!this.gameService.status$.value || !text) return;
    this.gameService.options[this.gameService.currentOption$.value].output = text ?? '';

    this.form.get('input')?.reset('');
    this.gameService.next();
  }

  panic() {
    if (!this.gameService.status$.value) return;
    this.input.nativeElement.focus();
    this.gameService.options[this.gameService.currentOption$.value].output = 'Error!';
    this.form.get('input')?.reset('');
    this.gameService.next();
  }
}
