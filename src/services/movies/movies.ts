import { validateOrReject } from 'class-validator';
import MatchMoviesDto from '../../dtos/MatchMovies';
import { Movie, StoreMovieDto } from '../../dtos/Movie';
import DB from '../db/db';

function filterByDuration(movies:Movie[], duration:number):Movie[] {
  return movies.filter((movie) => {
    const minDuration = duration - 10;
    const maxDuration = duration + 10;
    return movie.runtime >= minDuration && movie.runtime <= maxDuration;
  });
}

function filterByGenres(movies:Movie[], genres: string[]):Movie[] {
  const memo = new WeakMap<Movie, number>();
  function score(movie: Movie) {
    const value = (memo.get(movie));
    if (typeof value !== 'undefined') {
      return value;
    }
    const matches = movie.genres.reduce((count, g) => {
      if (genres.includes(g)) {
        return count + 1;
      }
      return count;
    }, 0);
    memo.set(movie, matches);
    return matches;
  }
  return movies.filter(((movie) => movie.genres.some((g) => genres.includes(g))))
    .sort((a, b) => score(b) - score(a));
}

function getRandom<T>(array:T[]): T {
  const randomIndex = Math.floor(Math.random() * array.length);
  return array[randomIndex];
}

const moviesService = {
  async storeMovie(movie: StoreMovieDto): Promise<Movie> {
    const movieDto = new StoreMovieDto();
    movieDto.genres = movie.genres;
    movieDto.title = movie.title;
    movieDto.year = movie.year;
    movieDto.runtime = movie.runtime;
    movieDto.director = movie.director;

    movieDto.actors = movie.actors;
    movieDto.plot = movie.plot;
    movieDto.posterUrl = movie.posterUrl;

    await this.validateMovie(movieDto);
    const newMovie = await DB.addMovie(movieDto);
    return newMovie;
  },
  getGenres() {
    return DB.genres;
  },
  async getMatchingMovies(matchMovies: MatchMoviesDto): Promise<Movie[]> {
    const matchMoviesDto = new MatchMoviesDto();
    matchMoviesDto.duration = matchMovies.duration;
    matchMoviesDto.genres = matchMovies.genres;
    await validateOrReject(matchMoviesDto);
    let movies = this.getMovies();

    if (typeof matchMoviesDto.duration !== 'undefined') {
      movies = filterByDuration(movies, matchMoviesDto.duration);
    }

    if (typeof matchMoviesDto.genres === 'undefined') {
      const randomMovie = getRandom(movies);
      if (!randomMovie) return [];
      return [randomMovie];
    }
    return filterByGenres(movies, matchMoviesDto.genres);
  },
  getMovies() {
    return DB.movies;
  },
  getMovie(movieId: number) {
    const movie = DB.movies.find((m) => m.id === movieId);
    return movie;
  },
  async validateMovie(movieDto: StoreMovieDto) {
    await validateOrReject(movieDto);
  },
};

export default moviesService;
