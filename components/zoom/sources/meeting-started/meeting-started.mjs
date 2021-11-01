import zoom from "../../zoom.app.mjs";

export default {
  key: "zoom-meeting-started",
  name: "Meeting Started",
  description:
    "Emits an event each time a meeting starts where you're the host",
  version: "0.0.3",
  dedupe: "unique", // Dedupe based on meeting ID
  props: {
    zoom,
    zoomApphook: {
      type: "$.interface.apphook",
      appProp: "zoom",
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
