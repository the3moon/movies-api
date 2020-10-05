import { ValidationError } from 'class-validator';
import moviesService from './movies';
import DB from '../db/db';
import { Movie, StoreMovieDto } from '../../dtos/Movie';

jest.mock('../db/db', () => ({
  addMovie: jest.fn().mockImplementation(
    (movie) => ({ ...movie, id: Math.ceil(Math.random() * 100) }),
  ),
  movies: [
    {
      id: 1,
      title: 'Beetlejuice',
      year: 1988,
      runtime: 92,
      genres: ['Comedy', 'Fantasy', 'Crime', 'Drama'],
      director: 'Tim Burton',
    },
    {
      id: 2,
      title: 'The Cotton Club',
      year: 1984,
      runtime: 127,
      genres: ['Comedy', 'Fantasy'],
      director: 'Francis Ford Coppola',
    },
    {
      id: 3,
      title: 'The Shawshank Redemption',
      year: 1994,
      runtime: 142,
      genres: ['Comedy', 'Drama'],
      director: 'Frank Darabont',
    },
    {
      id: 4,
      title: 'Crocodile Dundee',
      year: 1986,
      runtime: 97,
      genres: ['Drama'],
      director: 'Peter Faiman',
    },
    {
      id: 5,
      title: 'Valkyrie',
      year: '2008',
      runtime: '121',
      genres: ['Fantasy', 'Crime'],
      director: 'Bryan Singer',
    },
  ],
  genres: ['Comedy', 'Fantasy', 'Crime', 'Drama'],
}));

describe('test movies service', () => {
  describe('store movie', () => {
    it('should not store invalid movie object', async () => {
      const invalidMovie:any = {
        director: 3,
        genres: [],
        runtime: 'ten',
        title: true,
        year: '1004',
        additionalProp: 'should be ignored',
      };

      try {
        await moviesService.storeMovie(invalidMovie);
        expect(true).toBe(false);
      } catch (errors) {
        expect(DB.addMovie).toHaveBeenCalledTimes(0);
        expect(Array.isArray(errors)).toBe(true);
        expect(errors.length).toBe(5);
        errors.forEach((error:any) => {
          expect(error).toBeInstanceOf(ValidationError);
        });
        const invalidProps = errors.map((e:ValidationError) => e.property);
        expect(invalidProps).toEqual(expect.arrayContaining(['director', 'genres', 'runtime', 'title', 'year']));
      }
    });

    it('should validate optional params', async () => {
      const invalidMovie:any = {
        director: 'Jan',
        genres: ['Comedy'],
        runtime: 120,
        title: 'Test Movie',
        year: 2020,
        additionalProp: 'should be ignored',

        actors: 5,
        plot: {},
        posterUrl: true,
      };

      try {
        await moviesService.storeMovie(invalidMovie);
        expect(true).toBe(false);
      } catch (errors) {
        expect(DB.addMovie).toHaveBeenCalledTimes(0);
        expect(Array.isArray(errors)).toBe(true);
        expect(errors.length).toBe(3);
        errors.forEach((error:any) => {
          expect(error).toBeInstanceOf(ValidationError);
        });
        const invalidProps = errors.map((e:ValidationError) => e.property);
        expect(invalidProps).toEqual(expect.arrayContaining(['actors', 'plot', 'posterUrl']));
      }
    });

    it('should store valid movie', async () => {
      const validMovie: StoreMovieDto = {
        director: 'Jan',
        genres: ['Comedy'],
        runtime: 120,
        title: 'Test Movie',
        year: 2020,

        actors: 'Nobody',
        plot: 'Boring movie',
        posterUrl: 'https://google.com',
      };
      const movie = await moviesService.storeMovie({ ...validMovie, additionalProp: 'should be ignored' } as any);
      expect(movie).toHaveProperty('id');
      expect(movie).not.toHaveProperty('additionalProp');
      expect(movie).toMatchObject(validMovie);

      expect(DB.addMovie).toHaveBeenCalledTimes(1);
    });
  });

  describe('get matching movies', () => {
    beforeAll(() => {
    });

    it('should return random movie if no parameter is provided', async () => {
      const movies = await moviesService.getMatchingMovies({});
      expect(Array.isArray(movies)).toBe(true);
      expect(movies.length).toBe(1);
    });

    it('should return random movie within duration if no genres parameter is provided', async () => {
      const duration = 120;
      const durationPrecision = 10;

      const movies = await moviesService.getMatchingMovies({ duration });
      expect(Array.isArray(movies)).toBe(true);
      expect(movies.length).toBe(1);
      const receivedRuntime = movies[0].runtime;
      expect(receivedRuntime <= duration + durationPrecision).toBe(true);
      expect(receivedRuntime >= duration - durationPrecision).toBe(true);
    });

    it('should not return movie with imposible duration', async () => {
      const duration = 999999999;
      const movies = await moviesService.getMatchingMovies({ duration });
      expect(Array.isArray(movies)).toBe(true);
      expect(movies.length).toBe(0);
    });

    it('should return movies in genre if no duration is provided', async () => {
      const genres = ['Comedy', 'Fantasy', 'Crime'];
      const movies = await moviesService.getMatchingMovies({ genres });
      expect(Array.isArray(movies)).toBe(true);
      movies.forEach((movie) => {
        expect(movie.genres.some((g) => genres.includes(g))).toBe(true);
      });
      const scoreFirst = score(movies[0], genres);
      const scoreLast = score(movies[movies.length - 1], genres);
      expect(scoreFirst >= scoreLast).toBe(true);
      expect(scoreLast > 0).toBe(true);
    });

    it('should return movies in genre and in duration', async () => {
      const duration = 120;
      const genres = ['Comedy', 'Fantasy', 'Crime'];
      const durationPrecision = 10;

      const movies = await moviesService.getMatchingMovies({ duration, genres });
      expect(Array.isArray(movies)).toBe(true);
      movies.forEach((movie) => {
        const receivedRuntime = movie.runtime;
        expect(receivedRuntime <= duration + durationPrecision).toBe(true);
        expect(receivedRuntime >= duration - durationPrecision).toBe(true);
        expect(movie.genres.some((g) => genres.includes(g))).toBe(true);
      });
      const scoreFirst = score(movies[0], genres);
      const scoreLast = score(movies[movies.length - 1], genres);
      expect(scoreFirst >= scoreLast).toBe(true);
      expect(scoreLast > 0).toBe(true);
    });
  });
});

function score(movie: Movie, genres:string[]) {
  return movie.genres.reduce((count, g) => {
    if (genres.includes(g)) {
      return count + 1;
    }
    return count;
  }, 0);
}
