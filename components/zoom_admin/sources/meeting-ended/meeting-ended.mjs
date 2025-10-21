import zoomAdmin from "../../zoom_admin.app.mjs";

export default {
  key: "zoom_admin-meeting-ended",
  type: "source",
  name: "Meeting Ended",
  description: "Emits an event each time a meeting ends in your Zoom account",
  version: "0.1.8",
  dedupe: "unique", // Dedupe based on meeting ID
  props: {
    zoomAdmin,
    zoomApphook: {
      type: "$.interface.apphook",
      appProp: "zoomAdmin",
      eventNames: [
        "meeting.ended",
      ],
    },
  },
  async run(event) {
    const { payload } = event;
    const { object } = payload;
    this.$emit(event, {
      summary: `Meeting ${object.topic} ended`,
      id: object.uuid,
      ts: +new Date(object.end_time),
    });
  },
};
