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
        defaultMessage: (args: ValidationArguments) => {
          const { genres } = DB;
          const invalidValues = args.value.filter((g:string) => !genres.includes(g));
          return `Unkown value${invalidValues.length > 0 ? 's' : null} in ${args.property}: ${invalidValues.join(', ')}. Valid ${args.property} values are: ${genres.join(', ')}`;
        },
        validate(values: string[]) {
          const { genres } = DB;
          return values.every((value:string) => genres.includes(value));
        },
      },
    });
  };
}
