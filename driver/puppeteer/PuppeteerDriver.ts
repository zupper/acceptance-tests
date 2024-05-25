import * as E from "fp-ts/lib/Either";
import { TestDriver } from "../../dsl/TestDriver";

export class PuppeteerDriver implements TestDriver {
  constructor(url: string) {
  }

  login(email: string, password: string) {
    return Promise.resolve(E.left(new Error));
  }

  getUserProfile(userId: string, token: string) {
    return Promise.resolve(E.left(new Error));
  }
}
