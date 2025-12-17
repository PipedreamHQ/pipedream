import { ConfigurationError } from "@pipedream/platform";
import pipedream_utils from "../../pipedream_utils.app.mjs";
import commonDateTime from "../../common/date-time/commonDateTime.mjs";
import {
  DATE_FORMAT_PARSE_MAP, DEFAULT_FORMAT_VALUE,
} from "../../common/date-time/dateFormats.mjs";
import { DATE_TIME_UNITS } from "../../common/date-time/dateTimeUnits.mjs";
import sugar from "sugar";
const OPERATION_OPTIONS = {
  ADD: "Add",
  SUBTRACT: "Subtract",
};
export default {
  ...commonDateTime,
  name: "Formatting - [Date/Time] Add/Subtract Time",
  description: "Add or subtract time from a given input",
  key: "pipedream_utils-add-subtract-time",
  version: "0.0.6",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    ...commonDateTime.props,
    operation: {
      label: "Operation",
      description: "Whether to add or subtract time.",
      type: "string",
      options: Object.values(OPERATION_OPTIONS),
    },
    duration: {
      label: "Duration",
      description: "The duration for the operation. You can use the shorthand duration, for example: `1s`, `1m`, `1h`, `1d`, `1w`, `1y` equal one second, minute, hour, day, week, and year respectively",
      type: "string",
    },
    outputFormat: {
      propDefinition: [
        pipedream_utils,
        "outputFormat",
      ],
    },
  },
  methods: {
    ...commonDateTime.methods,
    getOperationMilliseconds(str) {
      let result = 0;
      const {
        second, minute, hour, day, week, year,
      } = DATE_TIME_UNITS;
      Object.entries({
        s: second,
        m: minute,
        h: hour,
        d: day,
        w: week,
        y: year,
      }).forEach(([
        identifier,
        multiplier,
      ]) => {
        const substr = str.match(new RegExp(`[0-9]+\\s*${identifier}`))?.[0];
        if (substr) {
          const value = Number(substr.match(/[0-9]+/));
          result += value * multiplier;
        }
      });
      return result;
    },
  },
  async run({ $ }) {
    const {
      operation, duration, outputFormat,
    } = this;
    const dateObj = this.getDateFromInput();
    const value = dateObj.valueOf();
    let amount = this.getOperationMilliseconds(duration);
    if (operation === OPERATION_OPTIONS.SUBTRACT)
      amount *= -1;
    const result = value + amount;
    const format = outputFormat ?? this.inputFormat ?? DEFAULT_FORMAT_VALUE;
    try {
      const { outputFn } = DATE_FORMAT_PARSE_MAP.get(format);
      const output = outputFn(sugar.Date.create(result));
      $.export("$summary", `Successfully ${operation === OPERATION_OPTIONS.SUBTRACT
        ? "subtracted"
        : "added"} time`);
      return output;
    }
    catch (err) {
      console.log("Error parsing date", err);
      throw new ConfigurationError("**Parse error** - check your input and if the selected format is correct.");
    }
  },
};
