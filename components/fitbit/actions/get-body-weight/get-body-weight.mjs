import fitbit from "../../fitbit.app.mjs";

export default {
  name: "Get Body Weight and BMI Logs",
  description: "Gets body weight and BMI log entries for a given date. [See the docs](https://dev.fitbit.com/build/reference/web-api/body/get-weight-logs/)",
  key: "fitbit-get-body-weight",
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

    const response = await this.fitbit.getWeightLogs({
      $,
      date,
    });

    $.export("$summary", `Successfully retrieved weight/BMI logs for ${date}`);
    return response;
  },
};
