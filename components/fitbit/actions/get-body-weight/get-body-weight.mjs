import { axios } from "@pipedream/platform";

export default {
  name: "Get Body Weight and BMI Logs",
  description: "Gets body weight and BMI log entries for a given date. [See the docs](https://dev.fitbit.com/build/reference/web-api/body/get-weight-logs/)",
  key: "fitbit-get-weight-bmi",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    fitbit: {
      type: "app",
      app: "fitbit",
    },
    date: {
      type: "string",
      label: "Date",
      description: "The date of the weight logs in the format yyyy-MM-dd. Defaults to today.",
      optional: true,
    },
  },

  async run({ $ }) {
    const date = this.date || "today";

    const response = await axios($, {
      url: `https://api.fitbit.com/1/user/-/body/log/weight/date/${date}.json`,
      headers: {
        Authorization: `Bearer ${this.fitbit.$auth.oauth_access_token}`,
      },
    });

    $.export("$summary", `Successfully retrieved weight/BMI logs for ${date}`);
    return response;
  },
};
