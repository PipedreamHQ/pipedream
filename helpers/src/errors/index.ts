import { STATUS_CODES } from "http";

// HTTPErrors are used to throw status-code specific errors
// in components that make HTTP requests
export class HTTPError extends Error {
  statusCode: number;
  name: string;
  message: string;

  constructor(code: number, name: string, message: string) {
    super(message);
    Error.captureStackTrace(this, this.constructor);
    this.name = `HTTP${code}Error`;
    this.message = `(${name}) ${message}`;
    this.statusCode = code;
  }
}

// Throw a no procotol error when you need to ensure protocols on URLs
export class NoProtocolError extends Error {
  name: string;

  constructor (message: string) {
    super(message);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

export function createHTTPError(code: number, name: string): (message: string) => HTTPError {
  return function (message: string): HTTPError {
    return new HTTPError(code, name, message);
  };
}

export function generateHTTPErrorClasses(): { [code: number]: (message: string) => HTTPError; } {
  const errorClasses: { [code: number]: (message: string) => HTTPError; } = {};
  const badStatusCodes = Object.keys(STATUS_CODES)
    .map((code) => Number(code))
    .filter((code) => code >= 400);

  for (const code of badStatusCodes) {
    const errorMsg = STATUS_CODES[code];
    if (!errorMsg) {
      continue;
    }
    const name = errorMsg.replace(/\W/g, "").concat("Error");
    errorClasses[code] = createHTTPError(code, name);
  }
  return errorClasses;
}
