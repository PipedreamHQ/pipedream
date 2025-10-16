import zoomAdmin from "../../zoom_admin.app.mjs";

export default {
  key: "zoom_admin-meeting-updated",
  type: "source",
  name: "Meeting Updated",
  description: "Emits an event each time a meeting is updated in your Zoom account",
  version: "0.1.7",
  dedupe: "unique", // dedupe on the meeting ID + timestamp
  props: {
    zoomAdmin,
    zoomApphook: {
      type: "$.interface.apphook",
      appProp: "zoomAdmin",
      eventNames: [
        "meeting.updated",
      ],
    },
  },
  async run(event) {
    const { payload } = event;
    const { object } = payload;
    this.$emit(event, {
      summary: `Meeting ${object.id} updated`,
      id: `${object.id}-${payload.time_stamp}`,
    });
  },
};
