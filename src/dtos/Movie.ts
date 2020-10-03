import {
  IsArray, IsEnum, IsInt, IsNotEmpty, IsString, MaxLength,
} from 'class-validator';
import Genre from './Genre';

export interface Movie {
    id: number;
    genres: Genre[] ;
    title: string ;
    year: number ;
    runtime: number ;
    director: string ;
    actors?: string ;
    plot?: string ;
    posterUrl?: string ;
}

export class StoreMovieDto {
    @IsNotEmpty()
    @IsArray()
    @IsEnum(Genre)
    genres!: Genre[] ;

    @IsNotEmpty()
    @IsString()
    @MaxLength(255)
    title!: string ;

    @IsNotEmpty()
    @IsInt()
    year!: number ;

    @IsNotEmpty()
    @IsInt()
    runtime!: number ;

    @IsNotEmpty()
    @IsString()
    @MaxLength(255)
    director!: string ;

    @IsString()
    actors?: string ;

    @IsString()
    plot?: string ;

    @IsString()
    posterUrl?: string ;
}
