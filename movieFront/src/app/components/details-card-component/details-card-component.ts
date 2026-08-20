import { Component, input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { LucideStar } from '@lucide/angular';
import { GetPosterService } from '../../services/get-poster-service';
import { MovieDetail } from '../../interfaces/general';

@Component({
  selector: 'app-details-card-component',
  imports: [MatCardModule, MatButtonModule, LucideStar],
  templateUrl: './details-card-component.html',
  styleUrl: './details-card-component.css',
})
export class DetailsCardComponent {
  myMovie = input.required<MovieDetail>();

  constructor(private getPosterService: GetPosterService) {}

  applyPoster(): string {
    return this.getPosterService.getPoster(this.myMovie()!.title);
  }
}
