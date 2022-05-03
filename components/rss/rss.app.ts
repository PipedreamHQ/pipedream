import { STATUS_CODES } from "http";
import {
  defineApp, HTTPError,
} from "@pipedream/types";

export default defineApp({
  type: "app",
  app: "rss",
  propDefinitions: {
    url: {
      type: "string",
      label: "Feed URL",
      description: "Enter the URL for any public RSS feed",
    },
  },
  methods: {
    // XXX Move these to a generic utils file
    createHTTPError(code: number, name: string): (message: string) => HTTPError {
      return function (message: string): HTTPError {
        return new HTTPError(code, name, message);
      };
    },
    generateHTTPErrorClasses(): { [code: number]: (message: string) => HTTPError } {
      const errorClasses: { [code: number]: (message: string) => HTTPError } = {};
      const badStatusCodes = Object.keys(STATUS_CODES)
        .map((code) => Number(code))
        .filter((code) => code >= 400);

      for (const code of badStatusCodes) {
        const errorMsg = STATUS_CODES[code];
        if (!errorMsg) {
          continue;
        }
        const name = errorMsg.replace(/\W/g, "").concat("Error");
        errorClasses[code] = this.createHTTPError(code, name);
      }
      return errorClasses;
    },
  },
});
