import { defineApp } from "@pipedream/types";
import { DATE_FORMAT_OPTIONS } from "../common/date-time/dateFormats";

export default defineApp({
  type: "app",
  app: "formatting",
  propDefinitions: {
    inputDate: {
      label: "Input Date",
      description:
        "A valid date string, in the format defined in `From Format`. If the format is not set, Pipedream will attempt to infer it from the input.",
      type: "string",
    },
    dateFormat: {
      label: "Date Format",
      type: "string",
      options: DATE_FORMAT_OPTIONS,
    },
  },
});
