import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { Movie, MovieDetail } from '../interfaces/general';
import { environment } from '../../environments/environment';
@Injectable({
  providedIn: 'root',
})
export class MovieService {
  searchString$ = new Subject<string>();

  constructor(private http: HttpClient) {}
  getMovies(): Observable<Movie[]> {
    return this.http.get<Movie[]>(environment.backendUrl);
  }

  getMovie(id: string): Observable<MovieDetail> {
    return this.http.get<MovieDetail>(`${environment.backendUrl}/${id}`);
  }

  getRecommendations(id: string): Observable<Movie[]> {
    return this.http.get<Movie[]>(`${environment.backendUrl}/${id}/recommendations`);
  }
}
