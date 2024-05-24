import { pipe } from 'fp-ts/lib/function';
import * as TE from 'fp-ts/lib/TaskEither';

import * as t from 'io-ts';

import { TestDriver } from '../../dsl/TestDriver';
import {
  AuthenticationError,
  WrongCredentialsError,
} from '../../dsl/Errors';

import {
  decodeAxiosResponseWithCodec,
  isAxios401,
  safeAxios,
} from './SafeAxios';

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

  login(email: string, password: string) {
    const url = `${this.#apiUrl}/login`;
    const data = { email, password };

    return pipe(
      safeAxios({ method: 'post', url, data }),
      TE.flatMapEither(decodeAxiosResponseWithCodec(UserAuthDecoder)),
      TE.mapLeft(e => isAxios401(e) ? WrongCredentialsError.of() : e),
    )();
  }

  getUserProfile(userId: string, token: string) {
    const url = `${this.#apiUrl}/user/profile`;
    const headers = { 'UserId': userId, 'AuthToken': token };

    return pipe(
      safeAxios({ method: 'get', url, headers }),
      TE.flatMapEither(decodeAxiosResponseWithCodec(UserProfileDecoder)),
      TE.mapLeft(e => isAxios401(e) ? AuthenticationError.of() : e)
    )();
  }
}

