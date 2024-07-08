import { describe, it, before } from 'node:test';
import { expect } from 'chai';

import { getTestDriver } from './test-setup'

import { App } from './dsl/App';
import { AuthenticationError, WrongCredentialsError } from './dsl/Errors';

describe('Auth acceptance tests', () => {
  let app: App;

  before(() => {
    app = App.getInstance(getTestDriver());
  });

  it('should fail login with a wrong email', async () => {
    expect(await app.login({ email: 'wrong-email@example.com' })).to.be.instanceof(WrongCredentialsError);
  });

  it('should fail login with a wrong password', async () => {
    expect(await app.login({ password: 'wrongpassword' })).to.be.instanceof(WrongCredentialsError);
  });

  it('should login user', async () => {
    await app.login();
    expect(await app.userProfile()).not.to.be.instanceof(Error);
  });

  it('should require a logged in user to get the user profile', async () => {
    await app.logout();
    expect(await app.userProfile()).to.be.instanceof(AuthenticationError);
  });
});

