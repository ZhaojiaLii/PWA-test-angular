import { Injectable } from '@angular/core';
import { HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(private httpClient: HttpClient) { }

  gimmeJokes() {
    return this.httpClient.get('https://api.chucknorris.io/jokes/random');
  }

  syncAPI() {
    return this.httpClient.get('http://localhost:3000/sync');
  }

  addPushSubscriber(sub: any) {
    return this.httpClient.post('/api/notifications', sub);
  }
}
