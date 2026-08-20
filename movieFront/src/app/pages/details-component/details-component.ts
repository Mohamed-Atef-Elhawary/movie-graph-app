import { Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { Movie, MovieDetail } from '../../interfaces/general';
import { MovieService } from '../../services/movie-service';
import { ToastrService } from 'ngx-toastr';
import { FailConfig } from '../../../config/toastr-config';
import { DetailsCardComponent } from '../../components/details-card-component/details-card-component';
import { MovieCardComponent } from '../../components/movie-card-component/movie-card-component';
import { debounceTime, distinctUntilChanged, Subscription } from 'rxjs';

@Component({
  selector: 'app-details-component',
  imports: [MatCardModule, MatButtonModule, DetailsCardComponent, MovieCardComponent],
  templateUrl: './details-component.html',
  styleUrl: './details-component.css',
})
export class DetailsComponent implements OnInit {
  movieId = signal<string>('');
  movieDetail = signal<MovieDetail | null>(null);
  storedRecommendedMovies = signal<Movie[]>([]);
  recommendedMovies = signal<Movie[]>([]);
  subscriptionString!: Subscription;
  constructor(
    private route: ActivatedRoute,
    private movieService: MovieService,
    private toastr: ToastrService,
  ) {}
  ngOnInit() {
    this.route.paramMap.subscribe((paramAsMap: ParamMap) => {
      const id: string | null = paramAsMap.get('id');
      if (id) {
        this.movieId.set(id);
        this.getMovie(this.movieId());
        this.getRecommendations(this.movieId());
      }
    });

    this.subscriptionString = this.movieService.searchString$
      .pipe(debounceTime(1000), distinctUntilChanged())
      .subscribe((searchString) => {
        this.applyFilter(searchString);
      });
  }

  getMovie(movieId: string) {
    this.movieService.getMovie(movieId).subscribe({
      next: (movie) => {
        this.movieDetail.set(movie);
      },
      error: () => {
        this.toastr.error('Please try again later', 'Error', FailConfig);
      },
    });
  }

  getRecommendations(movieId: string) {
    this.movieService.getRecommendations(movieId).subscribe({
      next: (movies) => {
        this.storedRecommendedMovies.set(movies);
        this.recommendedMovies.set(movies);
      },
      error: () => {
        this.toastr.error('Please try again later', 'Error', FailConfig);
      },
    });
  }

  applyFilter(searchString: string) {
    this.recommendedMovies.update(() => {
      return this.storedRecommendedMovies().filter((movie) => {
        return movie.title.toLowerCase().includes(searchString.toLowerCase());
      });
    });
  }

  ngOnDestroy() {
    this.subscriptionString.unsubscribe();
  }
}
