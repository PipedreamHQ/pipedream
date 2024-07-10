import { defineAction } from "@pipedream/types";
import commonDateTime from "../../common/date-time/commonDateTime";
import app from "../../app/formatting.app";
import { DATE_TIME_UNITS } from "../../common/date-time/dateTimeUnits";

export default defineAction({
  ...commonDateTime,
  name: "[Date/Time] Compare Dates",
  description:
    "Get the duration between two dates in days, hours, minutes, and seconds along with checking if they are the same.",
  key: "formatting-compare-dates",
  version: "0.0.5",
  type: "action",
  props: {
    ...commonDateTime.props,
    inputDate: {
      propDefinition: [
        app,
        "inputDate",
      ],
      label: "Start Date",
      description:
        "Enter start date string, in the format defined in `Input Format`. If the start date is after the end date, these dates will be swapped and in the output `datesSwapped` will be set to `true`.",
    },
    endDate: {
      propDefinition: [
        app,
        "inputDate",
      ],
      label: "End Date",
      description:
        "Enter end date string, in the format defined in `Input Format`. Timezone is assumed the same for both dates if not explicitly set.",
    },
  },
  async run({ $ }): Promise<object> {
    const startDateObj = this.getDateFromInput(this.inputDate);
    const endDateObj = this.getDateFromInput(this.endDate);

    const startValue = startDateObj.valueOf();
    const endValue = endDateObj.valueOf();

    const datesSwapped = startValue > endValue;

    let result = "equal";
    let remainingValue = Math.abs(endValue - startValue);

    if (remainingValue) {
      const arrResults = [];
      const arrUnits = Object.entries(DATE_TIME_UNITS).sort(
        (a, b) => b[1] - a[1],
      );

      for (const [
        word,
        unit,
      ] of arrUnits) {
        const amount = Math.floor(remainingValue / unit);
        if (amount) {
          arrResults.push(`${amount} ${amount === 1
            ? word
            : `${word}s`}`);

          remainingValue %= unit;
          if (!remainingValue) break;
        }
      }

      result = arrResults.join(", ");
    }

    $.export("$summary", "Successfully compared dates");
    return {
      datesSwapped,
      result,
    };
  },
});
