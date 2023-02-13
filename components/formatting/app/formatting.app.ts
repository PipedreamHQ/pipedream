import { defineApp } from "@pipedream/types";
import { DATE_FORMAT_OPTIONS } from "../common/date-time/dateFormats";

export default defineApp({
  type: "app",
  app: "formatting",
  propDefinitions: {
    inputDate: {
      label: "Input Date",
      description:
        "A valid date string, in the format selected in `Input Format`. If the format is not set, Pipedream will attempt to infer it from the input. If the input is an integer, it will be treated as a unix timestamp in seconds.",
      type: "string",
    },
    inputFormat: {
      label: "Input Format",
      type: "string",
      options: DATE_FORMAT_OPTIONS,
      description: "The format of the provided date.",
      optional: true,
    },
    outputFormat: {
      label: "Output Format",
      type: "string",
      options: DATE_FORMAT_OPTIONS,
      description: "The format of the output date. If not provided, the input format will be used (default is ISO 8601).",
      optional: true,
    },
  },
});
