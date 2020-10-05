import {
  ArrayNotEmpty,
  IsInt, IsOptional, Min,
} from 'class-validator';
import IsGenreArray from '../validators/IsGenreArray';

export default class MatchMoviesDto {
    @IsOptional()
    @IsInt()
    @Min(0)
    duration?: number;

    @IsOptional()
    @ArrayNotEmpty()
    @IsGenreArray()
    genres?: string[] ;
}
