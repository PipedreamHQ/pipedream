import { defineAction } from "@pipedream/types";
import { ConfigurationError } from "@pipedream/platform";
import { DATE_FORMAT_PARSE_MAP } from "../../common/date-time/dateFormats";
import commonDateTime from "../../common/date-time/commonDateTime";
import app from "../../app/formatting.app";
import sugar from "sugar";

export default defineAction({
  ...commonDateTime,
  name: "[Date/Time] Format",
  description: "Format a date string to another date string. For more examples on formatting, see the [Sugar Date Format](https://sugarjs.com/dates/#/Formatting) documentation.",
  key: "formatting-date-time-format",
  version: "0.0.6",
  type: "action",
  props: {
    ...commonDateTime.props,
    outputFormat: {
      propDefinition: [
        app,
        "outputFormat",
      ],
      description: "The format to convert the date to. For more examples on formatting, see the [Sugar Date Format](https://sugarjs.com/dates/#/Formatting) documentation.",
      optional: false,
    },
  },
  async run({ $ }): Promise<string | number> {
    const { outputFormat } = this;

    const dateObj = this.getDateFromInput();

    try {
      const response = DATE_FORMAT_PARSE_MAP.get(outputFormat);
      const output = response
        ? response.outputFn(dateObj)
        : sugar.Date.format(dateObj, outputFormat);

      $.export("$summary", "Successfully formatted date/time");
      return output;
    } catch (err) {
      throw new ConfigurationError("**Parse error** - check your input and if the selected format is correct.");
    }
  },
});
