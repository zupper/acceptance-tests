import * as E from 'fp-ts/lib/Either';
import { pipe } from 'fp-ts/lib/function';

import * as UserData from './generators/user';
import { TestDriver } from './TestDriver';
import { UserAuth  } from './User';

export class App {
  #driver: TestDriver;
  #auth?: UserAuth;

  static getInstance(driver: TestDriver) {
    return new App(driver);
  }

  constructor(driver: TestDriver) {
    this.#driver = driver;
    this.#auth = undefined;
  }

  async login(params: { email?: string; password?: string } = {}) {
    const defaults = UserData.regularUserLoginCredentials();
    const email = params.email ?? defaults.email;
    const password = params.password ?? defaults.password;

    const res = await this.#driver.login(email, password);
    this.#auth = E.isRight(res) ? res.right : undefined;

    return E.toUnion(res);
  }

  logout() {
    this.#auth = undefined;
  }

  async userProfile(params: { userId?: string; token?: string } = {}) {
    const userId = params.userId ?? this.#auth?.userId ?? '';
    const token = params.token ?? this.#auth?.token ?? '';

    return pipe(
      await this.#driver.getUserProfile(userId, token),
      E.toUnion
    );
  }
}
