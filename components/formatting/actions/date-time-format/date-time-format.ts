import { defineAction } from "@pipedream/types";
import { ConfigurationError } from "@pipedream/platform";
import { DATE_FORMAT_PARSE_MAP } from "../../common/date-time/dateFormats";
import commonDateTime from "../../common/date-time/commonDateTime";
import app from "../../app/formatting.app";

export default defineAction({
  ...commonDateTime,
  name: "[Date/Time] Format",
  description: "Format a date string to another date string",
  key: "formatting-date-time-format",
  version: "0.0.3",
  type: "action",
  props: {
    ...commonDateTime.props,
    outputFormat: {
      propDefinition: [
        app,
        "outputFormat",
      ],
      description: "The format to convert the date to.",
      optional: false,
    },
  },
  async run({ $ }): Promise<string | number> {
    const { outputFormat } = this;

    const dateObj = this.getDateFromInput();

    try {
      const { outputFn } = DATE_FORMAT_PARSE_MAP.get(outputFormat);
      const output = outputFn(dateObj);

      $.export("$summary", "Successfully formatted date/time");
      return output;
    } catch (err) {
      throw new ConfigurationError("**Parse error** - check your input and if the selected format is correct.");
    }
  },
});
