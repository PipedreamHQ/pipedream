import zoom from "../../zoom.app.mjs";

export default {
  key: "zoom-webinar-started",
  name: "Webinar Started",
  description:
    "Emits an event each time a webinar starts where you're the host",
  version: "0.0.3",
  dedupe: "unique", // Dedupe based on meeting ID
  props: {
    zoom,
    zoomApphook: {
      type: "$.interface.apphook",
      appProp: "zoom",
      eventNames: [
        "webinar.started",
      ],
    },
  },
  async run(event) {
    const { payload } = event;
    const { object } = payload;
    this.$emit(
      {
        event: "webinar.started",
        payload,
      },
      {
        summary: object.topic,
        id: object.uuid,
        ts: +new Date(object.start_time),
      },
    );
  },
};
