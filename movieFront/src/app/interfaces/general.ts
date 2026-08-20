export interface Movie {
  id: string;
  title: string;
  year: number;
  rating: number;
  director: string;
  genres: string[];
  poster?: string;
}

export interface MovieDetail extends Movie {
  actors: string[];
}
