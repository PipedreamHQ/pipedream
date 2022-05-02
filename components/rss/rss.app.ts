import { STATUS_CODES } from "http";
import { inherits } from "util";
import { defineApp } from "@pipedream/types";

export default defineApp({
  type: "app",
  app: "rss",
  methods: {
    // Generate a Node error class for every HTTP error
    // in the STATUS_CODES object.
    createHTTPError(code, name): (message: string) => void {
      return function(message) {
        Error.captureStackTrace(this, this.constructor);
        this.name = `HTTP${code}Error`;
        this.message = `(${name}) ${message}`;
        this.statusCode = code;
      };
    },
    generateHTTPErrorClasses(): { [code: number]: typeof Error } {
      const errorClasses = {};
      Object.keys(STATUS_CODES)
        .map((code) => Number(code))
        .filter((code) => code >= 400)
        .forEach((code) => {
          const name = STATUS_CODES[code]
            .replace(/\W/g, "")
            .concat("Error");
          errorClasses[code] = this.createHTTPError(code, name);
          inherits(errorClasses[code], Error);
        });
      return errorClasses;
    },
  },
});
