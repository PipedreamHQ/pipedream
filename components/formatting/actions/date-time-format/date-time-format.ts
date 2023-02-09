import { defineAction } from "@pipedream/types";
import { DATE_FORMAT_PARSE_MAP } from "../../common/date-time/dateFormats";
import commonDateTime from "../../common/date-time/commonDateTime";
import app from "../../app/formatting.app";

export default defineAction({
  ...commonDateTime,
  name: "[Date/Time] Format",
  description: "Format a date string to another date string",
  key: "formatting-date-time-format",
  version: "0.0.1",
  type: "action",
  props: {
    ...commonDateTime.props,
    outputFormat: {
      propDefinition: [
        app,
        "dateFormat",
      ],
      label: "Output Format",
      description: "The format to convert the date to.",
    },
  },
  async run({ $ }): Promise<string | number> {
    const { outputFormat } = this;

    const dateObj = this.getDateFromInput();

    const { outputFn } = DATE_FORMAT_PARSE_MAP.get(outputFormat);
    const output = outputFn(dateObj);

    $.export("$summary", "Successfully formatted date/time");
    return output;
  },
});
