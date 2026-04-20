import { axios } from "@pipedream/platform";

export default {
  name: "Get Daily Step Count",
  description: "Gets the daily step count for a specific date. [See the docs](https://dev.fitbit.com/build/reference/web-api/activity/get-activity-time-series/)",
  key: "fitbit-get-daily-steps",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: false,
    readOnlyHint: true,
  },
  props: {
    fitbit: {
      type: "app",
    		app: "fitbit",
    },
    date: {
      type: "string",
      label: "Date",
      description: "The date in the format yyyy-MM-dd. Defaults to today.",
      optional: true,
    },
  },

  async run({ $ }) {
    const date = this.date || "today";

    const response = await axios($, {
      url: `https://api.fitbit.com/1/user/-/activities/steps/date/${date}/1d.json`,
      headers: {
        "Authorization": `Bearer ${this.fitbit.$auth.oauth_access_token}`,
      },
    });

    $.summary = `Successfully retrieved step count for ${date}`;
    return response;
  },
};
