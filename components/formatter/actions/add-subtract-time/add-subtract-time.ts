import { defineAction } from "@pipedream/types";
import commonDateTime from "../../common/date-time/commonDateTime";
import { DATE_TIME_UNITS } from "../../common/date-time/dateTimeUnits";

const OPERATION_OPTIONS = {
  ADD: "Add",
  SUBTRACT: "Subtract",
};

export default defineAction({
  ...commonDateTime,
  name: "[Date/Time] Add/Subtract Time",
  description: "Add or subtract time from a given input",
  key: "expofp-add-subtract-time",
  version: "0.0.1",
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
      description:
        "The duration for the operation. You can use the shorthand duration, for example: `1s`, `1m`, `1h`, `1d`, `1w`, `1y` equal one second, minute, hour, day, week, and year respectively",
      type: "string",
    },
  },
  methods: {
    ...commonDateTime.methods,
    getOperationMilliseconds(str: string) {
      let result = 0;

      const { second, minute, hour, day, week, year } = DATE_TIME_UNITS;
      Object.entries({
        s: second,
        m: minute,
        h: hour,
        d: day,
        w: week,
        y: year,
      }).forEach(([identifier, multiplier]) => {
        const substr = str.match(new RegExp(`[0-9]+\\s*${identifier}`))?.[0];
        if (substr) {
          const value = Number(substr.match(/[0-9]+/));
          result += value * multiplier;
        }
      });

      return result;
    },
  },
  async run({ $ }): Promise<string> {
    const { operation, duration } = this;

    const dateObj = this.getDateFromInput();

    const value = dateObj.valueOf();
    let amount = this.getOperationMilliseconds(duration);
    if (operation === OPERATION_OPTIONS.SUBTRACT) amount *= -1;

    const result = value + amount;
    const output = new Date(result).toISOString();

    $.export(
      "$summary",
      `Successfully ${
        operation === OPERATION_OPTIONS.SUBTRACT ? "subtracted" : "added"
      } time`
    );
    return output;
  },
});
