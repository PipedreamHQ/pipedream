import { ConfigurationError } from "@pipedream/platform";
import { DATE_FORMAT_PARSE_MAP } from "../../common/date-time/dateFormats.mjs";
import commonDateTime from "../../common/date-time/commonDateTime.mjs";
import pipedream_utils from "../../pipedream_utils.app.mjs";
import sugar from "sugar";
export default {
  ...commonDateTime,
  name: "Formatting - [Date/Time] Format",
  description: "Format a date string to another date string. For more examples on formatting, see the [Sugar Date Format](https://sugarjs.com/dates/#/Formatting) documentation.",
  key: "pipedream_utils-date-time-format",
  version: "0.0.7",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    ...commonDateTime.props,
    outputFormat: {
      propDefinition: [
        pipedream_utils,
        "outputFormat",
      ],
      description: "The format to convert the date to. For more examples on formatting, see the [Sugar Date Format](https://sugarjs.com/dates/#/Formatting) documentation.",
      optional: false,
    },
  },
  async run({ $ }) {
    const { outputFormat } = this;
    const dateObj = this.getDateFromInput();
    try {
      const response = DATE_FORMAT_PARSE_MAP.get(outputFormat);
      const output = response
        ? response.outputFn(dateObj)
        : sugar.Date.format(dateObj, outputFormat);
      $.export("$summary", "Successfully formatted date/time");
      return output;
    }
    catch (err) {
      throw new ConfigurationError("**Parse error** - check your input and if the selected format is correct.");
    }
  },
};
