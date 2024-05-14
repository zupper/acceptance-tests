import axios from 'axios';

import * as E from 'fp-ts/lib/Either';
import { pipe } from 'fp-ts/lib/function';
import * as TE from 'fp-ts/lib/TaskEither';

import * as t from 'io-ts';

import { TestDriver } from '../dsl/TestDriver';
import { WrongCredentialsError, AuthenticationError, ValidationErrors } from '../dsl/Errors';
import { UserAuth, UserProfile } from '../dsl/User';

import { safeAxios, decodeAxiosResponseWithCodec } from './SafeAxios';

const UserAuthDecoder = t.type({
  userId: t.string,
  token: t.string,
});

const UserProfileDecoder = t.type({
  email: t.string,
  userId: t.string,
});

export class HTTPDriver implements TestDriver {
  #apiUrl: string;

  constructor(baseUrl: string) {
    this.#apiUrl = baseUrl;
  }

  login(email: string, password: string): Promise<E.Either<ValidationErrors | WrongCredentialsError | Error, UserAuth>> {
    return pipe(
      safeAxios({ method: 'post', url: `${this.#apiUrl}/login`, data: { email, password } }),
      TE.flatMapEither(decodeAxiosResponseWithCodec(UserAuthDecoder)),
      TE.mapLeft(e => axios.isAxiosError(e) && e.response?.status === 401 ? WrongCredentialsError.of() : e),
    )();
  }

  getUserProfile(userId: string, token: string): Promise<E.Either<ValidationErrors | AuthenticationError | Error, UserProfile>> {
    return pipe(
      safeAxios({ method: 'get', url: `${this.#apiUrl}/user/profile`, headers: { 'UserId': userId, 'AuthToken': token } }),
      TE.flatMapEither(decodeAxiosResponseWithCodec(UserProfileDecoder)),
      TE.mapLeft(e => axios.isAxiosError(e) && e.response?.status === 401 ? AuthenticationError.of() : e)
    )();
  }
}

