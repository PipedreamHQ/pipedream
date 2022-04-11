import strava from "../../strava.app.mjs";

export default {
  key: "strava-activity-created",
  name: "New Activity Created Event",
  description: "Emit new event when a new activity is created",
  version: "0.0.2",
  type: "source",
  props: {
    strava,
    stravaApphook: {
      type: "$.interface.apphook",
      appProp: "strava",
      eventNames: [
        "activity.create",
      ],
    },
  },
  async run(event) {
    console.log(event);
    let details;
    try {
      details = await this.strava.getActivity({
        activityId: event.object_id,
      });
    } catch (err) {
      console.log(`Error fetching activity details: ${err}`);
    }
    let summary = "Activity created";
    if (details && details.name) {
      summary += `: ${details.name}`;
    }
    this.$emit(
      {
        event,
        details,
      },
      {
        summary,
        ts: event.event_time * 1000,
      },
    );
  },
};
