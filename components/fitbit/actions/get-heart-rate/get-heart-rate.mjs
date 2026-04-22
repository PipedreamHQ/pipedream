// Readded
import fitbit from "../../fitbit.app.mjs";

export default {
  key: "fitbit-get-heart-rate",
  name: "Get Heart Rate",
  description: "Gets the heart rate intraday time series data on a specific date range for a 24 hour period. [See the documentation (https://dev.fitbit.com/build/reference/web-api/intraday/get-heartrate-intraday-by-interval/)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    fitbit,
    date: {
      type: "string",
      label: "Start Date",
      description: "Start date in `YYYY-MM-DD` format, or `today`.",
      default: "today",
    },
    endDate: {
      type: "string",
      label: "End Date",
      description: "End date in `YYYY-MM-DD` format, or `today`. Must be within 24 hours of Start Date.",
      default: "today",
    },
    detailLevel: {
      type: "string",
      label: "Detail Level",
      description: "The granularity of intraday heart rate data points.",
      options: [
        { label: "1 Second", value: "1sec" },
        { label: "1 Minute", value: "1min" },
        { label: "5 Minutes", value: "5min" },
        { label: "15 Minutes", value: "15min" },
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
      description: "Optional. Return data in a specific timezone (e.g. `UTC` or `America/New_York`).",
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

    // Build path: with or without time window
    let path;
    if (startTime && endTime) {
      path = `/1/user/-/activities/heart/date/${startDate}/${endDate}/${detailLevel}/time/${startTime}/${endTime}.json`;
    } else {
      path = `/1/user/-/activities/heart/date/${startDate}/${endDate}/${detailLevel}.json`;
    }

    // Append optional timezone query param
    const params = {};
    if (timezone) params.timezone = timezone;

    const response = await this.fitbit.makeRequest($, {
      path,
      params,
    });

    $.export("$summary", `Retrieved heart rate data from ${startDate} to ${endDate} at ${detailLevel} detail`);
    return response;
  },
};