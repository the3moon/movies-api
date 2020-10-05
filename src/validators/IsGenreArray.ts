import { registerDecorator, ValidationArguments, ValidationOptions } from 'class-validator';
import DB from '../services/db/db';

export default function IsGenreArray(validationOptions?: ValidationOptions) {
  return (object: Object, propertyName: string) => {
    registerDecorator({
      name: 'isGenreArray',
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: {
        defaultMessage: (args: ValidationArguments) => `${args.property} can have only: ${DB.genres.join(', ')}`,
        validate(values: string[]) {
          const { genres } = DB;
          return values.every((value:string) => genres.includes(value));
        },
      },
    });
  };
}
