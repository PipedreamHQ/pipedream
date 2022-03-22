const strava = require("../../strava.app.js");

module.exports = {
  key: "strava-activity-deleted",
  name: "New Activity Deleted Event",
  description: "Emit new event when an activity is deleted",
  version: "0.0.2",
  type: "source",
  props: {
    strava,
    stravaApphook: {
      label: "App hook",
      description: "Strava App webhook",
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
