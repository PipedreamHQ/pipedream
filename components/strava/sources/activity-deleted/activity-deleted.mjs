import strava from "../../strava.app.mjs";

export default {
  key: "strava-activity-deleted",
  name: "New Activity Deleted Event",
  description: "Emit new event when an activity is deleted",
  version: "0.0.2",
  type: "source",
  props: {
    strava,
    stravaApphook: {
      type: "$.interface.apphook",
      appProp: "strava",
      eventNames: [
        "activity.delete",
      ],
    },
  },
  async run(event) {
    console.log(event);
    this.$emit(
      {
        event,
      },
      {
        summary: `Activity deleted: ${event.object_id}`,
        ts: event.event_time * 1000,
      },
    );
  },
};
