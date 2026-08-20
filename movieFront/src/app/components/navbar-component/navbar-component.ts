import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterLink } from '@angular/router';
import { MovieService } from '../../services/movie-service';
@Component({
  selector: 'app-navbar-component',
  imports: [MatButtonModule, MatToolbarModule, FormsModule, RouterLink],
  templateUrl: './navbar-component.html',
  styleUrl: './navbar-component.css',
})
export class NavbarComponent {
  searchString: string = '';
  constructor(private movieService: MovieService) {}
  onInput() {
    this.movieService.searchString$.next(this.searchString);
  }
}
