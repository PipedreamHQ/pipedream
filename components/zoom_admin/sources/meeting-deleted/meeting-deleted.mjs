import zoomAdmin from "../../zoom_admin.app.mjs";

export default {
  key: "zoom_admin-meeting-deleted",
  type: "source",
  name: "Meeting Deleted",
  description: "Emits an event each time a meeting is deleted in your Zoom account",
  version: "0.1.10",
  dedupe: "unique", // Dedupe based on meeting ID
  props: {
    zoomAdmin,
    zoomApphook: {
      type: "$.interface.apphook",
      appProp: "zoomAdmin",
      eventNames: [
        "meeting.deleted",
      ],
    },
  },
  async run(event) {
    const { payload } = event;
    const { object } = payload;
    this.$emit(
      {
        event: "meeting.deleted",
        payload,
      },
      {
        summary: `Meeting ${object.topic} deleted`,
        id: object.uuid,
        ts: +new Date(object.start_time),
      },
    );
  },
};
