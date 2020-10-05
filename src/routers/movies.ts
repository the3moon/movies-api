import { Router } from 'express';
import expressAsyncHandler from 'express-async-handler';
import moviesController from '../controllers/movies';

const moviesRouter = Router();

moviesRouter.post('/', expressAsyncHandler(moviesController.storeMovie));
moviesRouter.get('/', expressAsyncHandler(moviesController.getMatchingMovies));

export default moviesRouter;
