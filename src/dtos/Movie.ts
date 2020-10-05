import {
  ArrayNotEmpty, IsInt, IsOptional, IsString, IsUrl, MaxLength, Min,
} from 'class-validator';
import IsGenreArray from '../validators/IsGenreArray';

export interface Movie {
    id: number;
    genres: string[] ;
    title: string ;
    year: number ;
    runtime: number ;
    director: string ;
    actors?: string ;
    plot?: string ;
    posterUrl?: string ;
}

export class StoreMovieDto {
    @ArrayNotEmpty()
    @IsGenreArray()
    genres: string[] ;

    @IsString()
    @MaxLength(255)
    title: string ;

    @IsInt()
    year: number ;

    @IsInt()
    @Min(0)
    runtime: number ;

    @IsString()
    @MaxLength(255)
    director: string ;

    @IsOptional()
    @IsString()
    actors?: string ;

    @IsOptional()
    @IsString()
    plot?: string ;

    @IsOptional()
    @IsUrl()
    posterUrl?: string ;
}
