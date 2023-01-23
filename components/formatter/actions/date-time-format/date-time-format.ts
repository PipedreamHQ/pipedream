import { defineAction } from "@pipedream/types";
import { DATE_FORMAT_PARSE_MAP } from "../../common/date-time/dateFormats";
import commonDateTime from "../../common/date-time/common-date-time";
import app from "../../app/formatter.app";

export default defineAction({
  ...commonDateTime,
  name: "[Date/Time] Format",
  description: "Format a date string to another date string",
  key: "expofp-date-time-format",
  version: "0.0.1",
  type: "action",
  props: {
    ...commonDateTime.props,
    toFormat: {
      propDefinition: [
        app,
        "dateFormat",
      ],
      label: "To Format",
      description: "The format to convert the date to.",
    },
  },
  async run({ $ }): Promise<string | number> {
    const { toFormat } = this;

    const dateObj = this.getDateFromInput();

    const { outputFn } = DATE_FORMAT_PARSE_MAP.get(toFormat);
    const output = outputFn(dateObj);

    $.export("$summary", "Successfully formatted date/time");
    return output;
  },
});
