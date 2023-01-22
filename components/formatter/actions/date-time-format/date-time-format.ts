import app from "../../app/formatter.app";
import { defineAction } from "@pipedream/types";
import { ConfigurationError } from "@pipedream/platform";
import {
  DateFormat,
  DATE_FORMAT_OPTIONS,
  DATE_FORMAT_PARSE_MAP,
  DEFAULT_INPUT_FUNCTION,
} from "../../common/dateFormats";

export default defineAction({
  name: "[Date/Time] Format",
  description: "Format a date string to another date string",
  key: "expofp-date-time-format",
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
      optional: true,
    },
    toFormat: {
      label: "To Format",
      description: "The format to convert the date to.",
      type: "string",
      options: DATE_FORMAT_OPTIONS,
    },
  },
  async run({ $ }): Promise<string | number> {
    const {
      inputDate, fromFormat, toFormat,
    }: Record<string, string> = this;
    let inputFn: DateFormat["inputFn"], dateObj: Date;

    try {
      inputFn =
        DATE_FORMAT_PARSE_MAP.get(fromFormat)?.inputFn ??
        DEFAULT_INPUT_FUNCTION;

      dateObj = inputFn(inputDate);

      if (isNaN(dateObj.getFullYear())) throw new Error("Invalid date");
    } catch (err) {
      throw new ConfigurationError(
        `**Error** parsing input \`${inputDate}\` ${
          fromFormat
            ? `expecting specified format \`${fromFormat}\``
            : "- try selecting a format in the **From Format** prop."
        }`,
      );
    }

    const { outputFn } = DATE_FORMAT_PARSE_MAP.get(toFormat);
    const output = outputFn(dateObj);

    $.export("$summary", "Successfully formatted date/time");
    return output;
  },
});
