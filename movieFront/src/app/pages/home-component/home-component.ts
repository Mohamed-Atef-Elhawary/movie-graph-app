import { Component, computed, signal } from '@angular/core';
import { MovieService } from '../../services/movie-service';
import { ToastrService } from 'ngx-toastr';
import { FailConfig } from '../../../config/toastr-config';
import { Movie } from '../../interfaces/general';
import { MovieCardComponent } from '../../components/movie-card-component/movie-card-component';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { GetPosterService } from '../../services/get-poster-service';
import { debounceTime, distinctUntilChanged, Subscription } from 'rxjs';

@Component({
  selector: 'app-home-component',
  imports: [MovieCardComponent, MatPaginatorModule],
  templateUrl: './home-component.html',
  styleUrl: './home-component.css',
})
export class HomeComponent {
  subscriptionString!: Subscription;
  storedMovieList = signal<Movie[]>([]);
  movieList = signal<Movie[]>([]);
  constructor(
    private movieService: MovieService,
    private toastr: ToastrService,
  ) {}

  ngOnInit() {
    this.getMovies();
    this.subscriptionString = this.movieService.searchString$
      .pipe(debounceTime(1000), distinctUntilChanged())
      .subscribe((searchString) => {
        this.applyFilter(searchString);
      });
  }

  getMovies() {
    this.movieService.getMovies().subscribe({
      next: (movies) => {
        this.storedMovieList.set(movies);
        this.movieList.set(movies);
      },
      error: (err) => {
        this.toastr.error('Please try again later', 'Error', FailConfig);
      },
    });
  }
  applyFilter(searchString: string) {
    this.movieList.update(() => {
      return this.storedMovieList().filter((movie) => {
        return movie.title.toLowerCase().includes(searchString.toLowerCase());
      });
    });
  }

  ngOnDestroy() {
    this.subscriptionString.unsubscribe();
  }
}
