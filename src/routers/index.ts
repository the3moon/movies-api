import { Router } from 'express';
import moviesRouter from './movies';

const appRouter = Router();

appRouter.use('/api/movies', moviesRouter);

export default appRouter;
