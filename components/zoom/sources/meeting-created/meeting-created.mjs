import zoom from "../../zoom.app.mjs";

export default {
  key: "zoom-meeting-created",
  name: "Meeting Created",
  description:
    "Emits an event each time a meeting is created where you're the host",
  version: "0.0.3",
  dedupe: "unique", // Dedupe based on meeting ID
  props: {
    zoom,
    zoomApphook: {
      type: "$.interface.apphook",
      appProp: "zoom",
      eventNames: [
        "meeting.created.by_me",
        "meeting.created.for_me",
      ],
    },
  },
  async run(event) {
    const { payload } = event;
    const { object } = payload;
    this.$emit(
      {
        event: "meeting.created",
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
