import zoomAdmin from "../../zoom_admin.app.mjs";

export default {
  key: "zoom_admin-meeting-started",
  type: "source",
  name: "Meeting Started",
  description: "Emits an event each time a meeting starts in your Zoom account",
  version: "0.0.3",
  dedupe: "unique", // Dedupe based on meeting ID
  props: {
    zoomAdmin,
    zoomApphook: {
      type: "$.interface.apphook",
      appProp: "zoomAdmin",
      eventNames: [
        "meeting.started",
      ],
    },
  },
  async run(event) {
    const { payload } = event;
    const { object } = payload;
    this.$emit(event, {
      summary: `Meeting ${object.topic} started`,
      id: object.uuid,
      ts: +new Date(object.start_time),
    });
  },
};
