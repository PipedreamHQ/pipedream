import fitbit from "../../fitbit.app.mjs";

export default {
  key: "fitbit-get-activity-summary",
  name: "Get Activity Summary",
  description: "Get a daily activity summary including calories, distance, and active minutes. [See the documentation](https://dev.fitbit.com/build/reference/web-api/activity/get-daily-activity-summary/)",
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
      propDefinition: [
        fitbit,
        "date",
      ],
    },
  },
  async run({ $ }) {
    const date = this.date || new Date()
      .toISOString()
      .slice(0, 10);
    const response = await this.fitbit.getActivitySummary({
      $,
      date,
    });

    const summary = response?.summary ?? {};
    const distanceByActivity = {};
    for (const item of summary.distances || []) {
      if (item?.activity) {
        distanceByActivity[item.activity] = item.distance;
      }
    }

    const veryActiveMinutes = summary.veryActiveMinutes ?? 0;
    const fairlyActiveMinutes = summary.fairlyActiveMinutes ?? 0;
    const lightlyActiveMinutes = summary.lightlyActiveMinutes ?? 0;

    const activitySummary = {
      date,
      calories: {
        out: summary.caloriesOut ?? null,
        bmr: summary.caloriesBMR ?? null,
      },
      distance: {
        total: distanceByActivity.total ?? null,
        tracker: distanceByActivity.tracker ?? null,
        logged: distanceByActivity.loggedActivities ?? null,
        byActivity: distanceByActivity,
      },
      activeMinutes: {
        very: veryActiveMinutes,
        fairly: fairlyActiveMinutes,
        lightly: lightlyActiveMinutes,
        sedentary: summary.sedentaryMinutes ?? null,
        total: veryActiveMinutes + fairlyActiveMinutes + lightlyActiveMinutes,
      },
      summary,
      goals: response?.goals ?? null,
      activities: response?.activities ?? [],
    };

    $.export("$summary", `Successfully retrieved Fitbit activity summary for ${date}.`);
    return activitySummary;
  },
};
