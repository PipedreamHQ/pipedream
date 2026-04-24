import fitbit from "../../fitbit.app.mjs";

export default {
  name: "Get Daily Step Count",
  description: "Gets the daily step count for a specific date. [See the docs](https://dev.fitbit.com/build/reference/web-api/activity/get-activity-time-series/)",
  key: "fitbit-get-daily-steps",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    fitbit,
    date: {
      propDefinition: [
        fitbit,
        "date",
      ],
    },
  },

  async run({ $ }) {
    const date = this.fitbit._getDateOrToday(this.date);

    const response = await this.fitbit.getDailySteps({
      $,
      date,
    });

    $.export("$summary", `Successfully retrieved step count for ${date}`);
    return response;
  },
};
