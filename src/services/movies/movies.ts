import { validateOrReject } from 'class-validator';
import { Movie, StoreMovieDto } from '../../dtos/Movie';
import DB from '../db/db';

async function validateMovie(movie: StoreMovieDto) {
  const obj = Object.assign(new StoreMovieDto(), movie);
  await validateOrReject(obj);
}

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
  async storeMovie(movieDto: StoreMovieDto): Promise<Movie> {
    await validateMovie(movieDto);
    const newMovie = await DB.addMovie(movieDto);
    return newMovie;
  },

};

export default moviesService;
