import { ValidationError } from 'class-validator';
/* eslint-disable no-unused-vars */
import { NextFunction, Request, Response } from 'express';
import StatusCode from '../utils/statusCodes';

export class WebError extends Error {
    status?: number;

    constructor(message:string, status?: number) {
      super(message);
      this.status = status;
    }
}

export const validationErrorHandler = (
  err: ValidationError[],
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  if (!(err[0] instanceof ValidationError)) {
    next(err);
  }
  res.status(StatusCode.BAD_REQUEST);
  res.send({ message: 'Validation Failed', code: StatusCode.BAD_REQUEST, errors: err });
};

export const errorHandler = (
  err: WebError,
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  const statusCode = err.status || 500;
  res.status(statusCode);
  res.send({ message: err.message, code: statusCode });
};