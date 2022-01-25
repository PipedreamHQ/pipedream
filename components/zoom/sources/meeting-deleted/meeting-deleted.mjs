import zoom from "../../zoom.app.mjs";

export default {
  key: "zoom-meeting-deleted",
  name: "Meeting Deleted",
  description:
    "Emits an event each time a meeting is deleted where you're the host",
  version: "0.0.3",
  dedupe: "unique", // Dedupe based on meeting ID
  props: {
    zoom,
    zoomApphook: {
      type: "$.interface.apphook",
      appProp: "zoom",
      eventNames: [
        "meeting.deleted.by_me",
        "meeting.deleted.for_me",
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
