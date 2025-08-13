import { inject, Injectable } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { BehaviorSubject, filter, interval, map, scan, skip, switchMap, takeWhile } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GameService {

  private router = inject(Router);

  options = [
    { input: `JSON.parse('"test"')`, answer: `"test"`, output: '' },
    { input: `JSON.parse("'test'")`, answer: `Error!`, output: '' },
    { input: `JSON.parse("-0")`, answer: `0`, output: '' },
    { input: `JSON.parse("10e5")`, answer: `1000000`, output: '' },
    { input: `JSON.parse("0x1")`, answer: `Error!`, output: '' },
    { input: `JSON.stringify("NaN")`, answer: `"null"`, output: '' },
    { input: `JSON.stringify("Infinity")`, answer: `"null"`, output: '' },
    { input: `JSON.stringify(() => { })`, answer: `undefined`, output: '' },
    { input: `JSON.stringify(undefined)`, answer: `undefined`, output: '' },
    { input: `JSON.parse(JSON.stringify(undefined))`, answer: `Error!`, output: '' },
    { input: `JSON.stringify([undefined])`, answer: `"[null]"`, output: '' },
    { input: `JSON.stringify({foo:undefined})`, answer: `"{}"`, output: '' },
  ];
  status$ = new BehaviorSubject(false);
  timer$ = this.status$.pipe(
    switchMap(() => interval(1000)),
    // scan((acc) => acc + 1, 0),
  );

  time = toSignal(this.timer$, { initialValue: 0 });


  currentOption$ = new BehaviorSubject<number>(0);

  displayedOptions$ = this.status$.pipe(
    filter(status => status),
    switchMap(() => this.currentOption$),
    switchMap((optionIndex) => {
      const currentOption = this.options[optionIndex];
      return interval(50).pipe(
        map(index => { return { text: currentOption.input.slice(0, index + 1), currentOption }; }),
      );
    }),
    filter(({ text, currentOption }) => text.length <= currentOption.input.length),
    map(({ text }) => text)
  );



  public start() {
    this.options.forEach(option => option.output = '');
    this.shuffleOptions();
    this.currentOption$.next(0);
    this.status$.next(true);
  }

  public stop() {
    const correctAnswers = this.options.reduce((acc, option) => {
      return acc + (option.output === option.answer ? 1 : 0);
    }, 0);
    this.status$.next(false);
    this.router.navigate(['/scoreboard'], { queryParams: { time: this.time(), total: this.options.length, correct: correctAnswers } });
  }

  private shuffleOptions() {
    this.options.sort(() => Math.random() - 0.5);
  }
  next() {
    const nextIndex = this.currentOption$.value + 1;
    if (nextIndex >= this.options.length) {
      this.stop();
    }
    this.currentOption$.next(nextIndex);
  }
}
