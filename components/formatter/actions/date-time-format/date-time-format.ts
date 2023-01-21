import app from "../../app/formatter.app";
import { defineAction } from "@pipedream/types";
import { DATE_FORMAT_OPTIONS } from "../../common/dateFormats";

export default defineAction({
  name: "[Date/Time] Format",
  description: "Format a date string to another date string",
  key: "formatter-date-time-format",
  version: "0.0.1",
  type: "action",
  props: {
    app,
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
    },
    toFormat: {
      label: "To Format",
      description: "The format to convert the date to.",
      type: "string",
      options: DATE_FORMAT_OPTIONS,
    },
  },
  async run({ $ }): Promise<object> {
    $.export("$summary", "Successfully added keyword");
    return null;
  },
});
