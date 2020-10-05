import {
  ArrayNotEmpty,
  IsInt, IsOptional, Min,
} from 'class-validator';
import IsArrayOfGenres from '../validators/IsArrayOfGenres';

export default class MatchMoviesDto {
    @IsOptional()
    @IsInt()
    @Min(0)
    duration?: number;

    @IsOptional()
    @ArrayNotEmpty()
    @IsArrayOfGenres()
    genres?: string[] ;
}
