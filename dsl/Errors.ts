export class WrongCredentialsError extends Error {
  public _tag: 'WrongCredentialsError';

  private constructor() {
    super('Wrong credentials')
    this._tag = 'WrongCredentialsError';
  }

  public static of(): WrongCredentialsError {
    return new WrongCredentialsError();
  }
}

export class AuthenticationError extends Error {
  public _tag: 'AuthenticationError';

  private constructor() {
    super('Authentication error')
    this._tag = 'AuthenticationError';
  }

  public static of(): AuthenticationError {
    return new AuthenticationError();
  }
}

export class ValidationErrors extends Error {
  public _tag: 'ValidationErrors';
  public errors: string[];

  private constructor(errors: string[]) {
    super('Validation errors')
    this._tag = 'ValidationErrors';
    this.errors = errors;
  }

  public static of(errors: string[]): ValidationErrors {
    return new ValidationErrors(errors);
  }
}
