import { validateOrReject } from 'class-validator';
import { Movie, StoreMovieDto } from '../../dtos/Movie';
import DB from '../db/db';

const moviesService = {
  getGenres() {
    return DB.genres;
  },
  getMovies() {
    return DB.movies;
  },
  getMovie(movieId: number) {
    const movie = DB.movies.find((m) => m.id === movieId);
    return movie;
  },
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
  async validateMovie(movieDto: StoreMovieDto) {
    await validateOrReject(movieDto);
  },

};

export default moviesService;
