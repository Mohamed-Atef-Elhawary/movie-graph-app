import { Component, input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { Movie } from '../../interfaces/general';
import { RouterLink } from '@angular/router';
import { GetPosterService } from '../../services/get-poster-service';

@Component({
  selector: 'app-movie-card-component',
  imports: [MatCardModule, MatButtonModule, RouterLink],
  templateUrl: './movie-card-component.html',
  styleUrl: './movie-card-component.css',
})
export class MovieCardComponent {
  movieInput = input.required<Movie>();
  constructor(private getPosterService: GetPosterService) {}
  applyPoster(): string {
    return this.getPosterService.getPoster(this.movieInput().title);
  }
}
