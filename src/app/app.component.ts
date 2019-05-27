import {Component, Injectable, OnInit, ApplicationRef} from '@angular/core';
import { SwUpdate, SwPush } from '@angular/service-worker';
import { DataService } from './data.service';
import {concat, interval, Subscription} from 'rxjs';
import { first } from 'rxjs/operators';



@Component({
  selector: 'app-root',
  styleUrls: ['./app.component.css'],
  // templateUrl: './app.component.html'
  template: `
    <h1 style="alignment: center">Jokes</h1>
    <button class="button-sub" (click)="subscribeToNotifications()">Subscribe</button>
    <button class="button-sync" (click)="registerBackgroundSync()">Sync</button>
    <p class="joke" *ngIf="joke" style="alignment: center">{{joke.value}}</p>
  `
})

export class AppComponent implements OnInit {

  update: boolean;
  joke: object;
  sub: PushSubscription;
  readonly VAPID_PUBLIC_KEY = 'BApAO10ISTLAR1bWho_6f4yL5-5z2RWHgnkqzG7SB81WdcsLkDdxrc1iWwHZ49trIUFekIEFGyBjomxjuKDZGc8';

  constructor(
    appRef: ApplicationRef,
    updates: SwUpdate,
    private data: DataService,
    private swPush: SwPush) {
    const appIsStable$ = appRef.isStable.pipe(first(isStable => isStable === true));
    const everySixHours$ = interval(3 * 1000);
    const everySixHoursOnceAppIsStable$ = concat(appIsStable$, everySixHours$);
    everySixHoursOnceAppIsStable$.subscribe(() => {
      updates.checkForUpdate();
      // console.log('check update in Service Worker');
    });
    updates.available.subscribe(event => {
      console.log('gotta new version here', event.available);
      updates.activateUpdate().then(() => document.location.reload());
    });
  }
  title = 'PWA';
  ngOnInit() {
    this.data.gimmeJokes().subscribe(
      res => {
        this.joke = res;
      }
    );
  }

  subscribeToNotifications() {
    this.swPush.requestSubscription({
      serverPublicKey: this.VAPID_PUBLIC_KEY
    }).then(sub => {
      console.log(sub);
      this.sub = sub;
      this.data.addPushSubscriber(sub).subscribe(
          () => console.log('send push notification object to server'),
          err =>  console.log('Could not send subscription object to server, reason: ', err)
      );
    })
      .catch(err => console.error('Could not subscribe to notifications', err));
  }

  registerBackgroundSync() {
    navigator.serviceWorker.ready.then(
      registration => registration.sync.register('syncTag')
        .then(() => console.log('Registered background sync'))
        .catch(err => console.error('Error registering background sync', err))
    );
  }
}




