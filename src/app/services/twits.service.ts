import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TwitsService {

  constructor(private http: HttpClient) { }
  baseUrl: string = 'https://nodeservertwitter.herokuapp.com/'

  getTweets(): Observable<any> {
    return this.http.get(this.baseUrl+'tweets');
  }

  getTweetsFiltered(dataFilter: string): Observable<any> {
    return this.http.get(`${this.baseUrl}search/${dataFilter}`)
  }
}
