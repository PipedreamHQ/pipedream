import strava from "../../strava.app.mjs";

export default {
  key: "strava-custom-events",
  name: "New Custom Event",
  description: "Emit new event when an activity is created, updated, or deleted",
  version: "0.0.3",
  type: "source",
  props: {
    strava,
    eventNameOptions: {
      label: "Strava Events",
      description: "Select from events",
      type: "string[]",
      async options() {
        return [
          "activity.create",
          "activity.update",
          "activity.delete",
        ];
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
    const ts = event.event_time * 1000;
    if (event.object_type === "activity") {
      let details;
      // Optimistically fetch activity details. When an event is deleted, this will fail
      try {
        details = await this.strava.getActivity({
          activityId: event.object_id,
        });
      } catch (err) {
        console.log(`Error fetching activity details: ${err}`);
      }
      this.$emit(
        {
          event,
          details,
        },
        {
          summary: `Activity ${event.aspect_type}d`,
          ts,
        },
      );
    }
  },
};
