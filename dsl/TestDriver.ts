import * as E from 'fp-ts/lib/Either';
import { WrongCredentialsError, AuthenticationError, ValidationErrors } from './Errors';
import { UserAuth, UserProfile } from './User';

export interface TestDriver {
  login:
    (email: string, password: string) =>
      Promise<E.Either<ValidationErrors | WrongCredentialsError | Error, UserAuth>>

  getUserProfile:
    (userId: string, token: string) =>
      Promise<E.Either<ValidationErrors | AuthenticationError | Error, UserProfile>> }

