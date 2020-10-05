import { Request, Response } from 'express';
import moviesService from '../services/movies/movies';

const moviesController = {
  async storeMovie(req: Request, res: Response):Promise<void> {
    const movie = await moviesService.storeMovie(req.body);
    res.send(movie);
  },
  async getMatchingMovies(req: Request, res: Response):Promise<void> {
    const movies = await moviesService.getMatchingMovies({
      duration: typeof req.query.duration === 'string' ? parseInt(req.query.duration, 10) : undefined,
      // @ts-ignore
      genres: Array.isArray(req.query.genres) ? req.query.genres : undefined,
    });
    res.send(movies);
  },
};

export default moviesController;
