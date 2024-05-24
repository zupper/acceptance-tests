import axios, { AxiosResponse, AxiosRequestConfig } from 'axios';

import * as E from 'fp-ts/lib/Either';
import { pipe } from 'fp-ts/lib/function';
import * as TE from 'fp-ts/lib/TaskEither';

import * as t from 'io-ts';
import { PathReporter } from 'io-ts/lib/PathReporter';

import { ValidationErrors } from '../../dsl/Errors';

export const convertDecodingErrors =
  (e: t.Errors): ValidationErrors =>
    pipe(
      E.left(e),
      PathReporter.report,
      ValidationErrors.of
    );

export const decodeAxiosResponseWithCodec =
  <T>(c: t.Decoder<unknown, T>) =>
    (r: AxiosResponse): E.Either<ValidationErrors | Error, T> =>
      pipe(
        r?.data,
        c.decode,
        E.mapLeft(convertDecodingErrors)
      );

export const safeAxios =
  (c: AxiosRequestConfig): TE.TaskEither<Error, AxiosResponse> =>
    TE.tryCatch(
      () => axios(c),
      (e) => e instanceof Error ? e : new Error(String(e))
    );


export const isAxios401 =
  (e: Error) => axios.isAxiosError(e) && e.response?.status === 401;

