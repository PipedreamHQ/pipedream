import { defineApp } from "@pipedream/types";
import { DATE_FORMAT_OPTIONS } from "../common/dateFormats";

export default defineApp({
  type: "app",
  app: "expofp",
  propDefinitions: {
    inputDate: {
      label: "Input Date",
      description:
        "A valid date string, in the format defined in `From Format`. If the format is not set, Pipedream will attempt to infer it from the input.",
      type: "string",
    },
    fromFormat: {
      label: "From Format",
      description: "The format of the provided date.",
      type: "string",
      options: DATE_FORMAT_OPTIONS,
      optional: true,
    },
  },
});
