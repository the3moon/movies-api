import { ValidationError } from 'class-validator';
import moviesService from './movies';
import DB from '../db/db';
import { StoreMovieDto } from '../../dtos/Movie';

describe('test movies service', () => {
  const mockAddMovie = jest.fn().mockImplementation(
    (movie) => ({ ...movie, id: Math.ceil(Math.random() * 100) }),
  );

  beforeAll(async () => {
    await DB.init();
    DB.addMovie = mockAddMovie;
  });

  it('should not store invalid movie object', async () => {
    const invalidMovie:any = {
      director: 3,
      genres: ['invalid'],
      runtime: 'ten',
      title: true,
      year: '1004',
      additionalProp: 'should be ignored',
    };

    try {
      await moviesService.storeMovie(invalidMovie);
      expect(true).toBe(false);
    } catch (errors) {
      expect(mockAddMovie).toHaveBeenCalledTimes(0);
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
      expect(mockAddMovie).toHaveBeenCalledTimes(0);
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

    expect(mockAddMovie).toBeCalledTimes(1);
  });
});
