const strava = require("../../strava.app.js");

module.exports = {
  key: "strava-custom-events",
  name: "Custom Events",
  description:
    "Emits an event when an activity is created, updated, or deleted",
  version: "0.0.1",
  props: {
    strava,
    eventNameOptions: {
      label: "Strava Events",
      type: "string[]",
      async options() {
        return ["activity.create", "activity.update", "activity.delete"];
      },
    },
    stravaApphook: {
      type: "$.interface.apphook",
      appProp: "strava",
      async eventNames() {
        return this.eventNameOptions;
      },
    },
  },
  async run(event) {
    console.log(event);
    const { object_type, object_id, event_time } = event;
    const ts = event_time * 1000;

    if (object_type === "activity") {
      let details;
      // Optimistically fetch activity details. When an event is deleted, this will fail
      try {
        details = await this.strava.getActivity(object_id);
      } catch (err) {
        console.log(`Error fetching activity details: ${err}`);
      }
      this.$emit(
        { event, details },
        {
          summary: `Activity ${event.aspect_type}d`,
          ts,
        }
      );
    }
  },
};
