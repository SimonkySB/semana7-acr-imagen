import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { BehaviorSubject, interval, scan, startWith, Subject, switchMap, takeUntil } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {

  
  timeSeconds = 0;
  isRunning = false;

  private reset$ = new Subject<void>();
  private pause$ = new BehaviorSubject<boolean>(true);


  ngOnInit(): void {
    this.pause$.pipe(
      switchMap(isPaused => 
        isPaused 
          ? []
          : interval(1000).pipe(
              scan(time => time + 1, this.timeSeconds)
            )
      )
    ).subscribe(time => this.timeSeconds = time as number);
  }


  startTimer() {
    this.isRunning = true;
    this.pause$.next(false);
  }

  pauseTimer() {
    this.isRunning = false;
    this.pause$.next(true);
  }

  resetTimer() {
    this.isRunning = false;
    this.timeSeconds = 0;
    this.reset$.next();
    this.pause$.next(true);
  }

  ngOnDestroy() {
    this.reset$.complete();
    this.pause$.complete();
  }


  formatTime() {
    const minutes: number = Math.floor(this.timeSeconds / 60);
    const seconds: number = this.timeSeconds % 60;
    return `${this.padZero(minutes)}:${this.padZero(seconds)}`;
  }

  private padZero(num: number): string {
    return num < 10 ? '0' + num : num.toString();
  }

}
