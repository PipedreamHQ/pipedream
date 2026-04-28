import fitbit from "../../fitbit.app.mjs";

export default {
  key: "fitbit-get-heart-rate",
  name: "Get Heart Rate",
  description: "Gets the heart rate intraday time series data on a specific date range for a 24 hour period. [See the documentation](https://dev.fitbit.com/build/reference/web-api/intraday/get-heartrate-intraday-by-interval/)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    fitbit,
    startDate: {
      propDefinition: [
        fitbit,
        "startDate",
      ],
    },
    endDate: {
      propDefinition: [
        fitbit,
        "endDate",
      ],
    },
    detailLevel: {
      type: "string",
      label: "Detail Level",
      description: "The granularity of intraday heart rate data points.",
      options: [
        {
          label: "1 Second",
          value: "1sec",
        },
        {
          label: "1 Minute",
          value: "1min",
        },
        {
          label: "5 Minutes",
          value: "5min",
        },
        {
          label: "15 Minutes",
          value: "15min",
        },
      ],
      default: "1min",
    },
    startTime: {
      type: "string",
      label: "Start Time",
      description: "Optional. Limit results to a time window starting at this time, in `HH:mm` format (e.g. `08:00`).",
      optional: true,
    },
    endTime: {
      type: "string",
      label: "End Time",
      description: "Optional. Limit results to a time window ending at this time, in `HH:mm` format (e.g. `08:30`). Requires Start Time.",
      optional: true,
    },
    timezone: {
      type: "string",
      label: "Timezone",
      description: "Optional. Return data in `UTC`. Fitbit's heart rate intraday endpoint only supports `UTC` for this parameter.",
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      startDate,
      endDate,
      detailLevel,
      startTime,
      endTime,
      timezone,
    } = this;
    const resolvedEndDate = endDate || startDate;

    const response = await this.fitbit.getHeartRate({
      $,
      startDate,
      endDate: resolvedEndDate,
      detailLevel,
      startTime,
      endTime,
      timezone,
    });

    $.export("$summary", `Retrieved heart rate data from ${startDate} to ${resolvedEndDate} at ${detailLevel} detail`);
    return response;
  },
};
