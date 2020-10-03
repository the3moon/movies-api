import { Request, Response } from 'express';
import moviesService from '../services/movies/movies';

const moviesController = {
  async storeMovie(req: Request, res: Response):Promise<void> {
    const movie = await moviesService.storeMovie(req.body);
    res.send(movie);
  },
};

export default moviesController;
