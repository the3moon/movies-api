import { readFile, writeFile } from 'fs';
import { join } from 'path';
import Genre from '../../dtos/Genre';
import { Movie, StoreMovieDto } from '../../dtos/Movie';

const dataLocation = '../../../data/db.json';
const dataPath = join(__dirname, dataLocation);

let data:{
  genres: Genre[],
  movies: Movie[]
};
let initialized = false;
let lastMovieId:number;

const DB = {
  async save() {
    if (!initialized) throw new Error('DB was not initialized');
    const stringifiedData = JSON.stringify(data, undefined, 4);
    await new Promise<void>((res, rej) => {
      writeFile(dataPath, stringifiedData, (err) => {
        if (err) rej(err);
        res();
      });
    });
  },
  async init() {
    if (initialized) return;
    const stringifiedData = await new Promise<string>((res, rej) => {
      readFile(dataPath, { encoding: 'utf-8' }, (err, resp) => {
        if (err) rej(err);
        res(resp);
      });
    });
    data = JSON.parse(stringifiedData);
    lastMovieId = Math.max(...data.movies.map((m) => m.id));
    initialized = true;
  },
  get genres() {
    return [...data.genres];
  },
  get movies() {
    return [...data.movies];
  },
  async addMovie(validMovie:StoreMovieDto):Promise<Movie> {
    lastMovieId += 1;
    const newMovie = { ...validMovie, id: lastMovieId };
    data.movies.push(newMovie);
    await this.save();
    return newMovie;
  },
};

export default DB;
