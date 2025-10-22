import zoomAdmin from "../../zoom_admin.app.mjs";

export default {
  key: "zoom_admin-meeting-created",
  type: "source",
  name: "Meeting Created",
  description: "Emits an event each time a meeting is created in your Zoom account",
  version: "0.1.8",
  dedupe: "unique", // Dedupe based on meeting ID
  props: {
    zoomAdmin,
    zoomApphook: {
      type: "$.interface.apphook",
      appProp: "zoomAdmin",
      eventNames: [
        "meeting.created",
      ],
    },
  },
  async run(event) {
    const { payload } = event;
    const { object } = payload;
    this.$emit(
      {
        event,
        payload,
      },
      {
        summary: `Meeting ${object.topic} created`,
        id: object.uuid,
        ts: +new Date(object.start_time),
      },
    );
  },
};
