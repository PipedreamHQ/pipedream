import app from "../../app/formatter.app";
import { defineAction } from "@pipedream/types";
import { ConfigurationError } from "@pipedream/platform";
import {
  DateFormat,
  DATE_FORMAT_PARSE_MAP,
  DEFAULT_INPUT_FUNCTION,
} from "../../common/dateFormats";

export default defineAction({
  name: "[Date/Time] Add/Subtract Time",
  description: "Add or subtract time from a given input",
  key: "expofp-add-subtract-time",
  version: "0.0.1",
  type: "action",
  props: {
    app,
    inputDate: {
      propDefinition: [
        app,
        "inputDate",
      ],
    },
    fromFormat: {
      propDefinition: [
        app,
        "fromFormat",
      ],
    },
    operation: {
      label: "Operation",
      description: "Whether to add or subtract time.",
      type: "string",
      options: [
        "Add",
        "Subtract",
      ],
    },
    duration: {
      label: "Duration",
      description:
        "The duration for the operation. You can use the shorthand duration, for example: `1s`, `1m`, `1h`, `1d`, `1w`, `1y` equal one second, minute, hour, day, week, and year respectively",
      type: "string",
    },
  },
  methods: {
    getOperationMilliseconds(str: string) {
      let result = 0;

      const seconds = 1000;
      const minutes = 60 * seconds;
      const hours = 60 * minutes;
      const days = 24 * hours;
      const weeks = 7 * days;
      const years = 365 * days;

      Object.entries({
        s: seconds,
        m: minutes,
        h: hours,
        d: days,
        w: weeks,
        y: years,
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
  async run({ $ }): Promise<string | number> {
    const {
      inputDate, fromFormat, operation, duration,
    } = this;

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

    const value = dateObj.valueOf();
    let amount = this.getOperationMilliseconds(duration);
    if (operation === "Subtract") amount *= -1;

    const result = value + amount;
    const output = new Date(result).toISOString();

    $.export(
      "$summary",
      `Successfully ${operation === "Subtract"
        ? "subtracted"
        : "added"} time`,
    );
    return output;
  },
});
