const strava = require("../../strava.app.js");

module.exports = {
  key: "strava-activity-deleted",
  name: "Activity Deleted",
  description: "Emits an event when an activity is deleted",
  version: "0.0.1",
  props: {
    strava,
    stravaApphook: {
      type: "$.interface.apphook",
      appProp: "strava",
      eventNames: ["activity.delete"],
    },
  },
  async run(event) {
    console.log(event);
    this.$emit(
      { event },
      {
        summary: `Activity deleted: ${event.object_id}`,
        ts: event.event_time * 1000,
      }
    );
  },
};
