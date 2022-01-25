import zoom from "../../zoom.app.mjs";

export default {
  key: "zoom-webinar-ended",
  name: "Webinar Ended",
  description: "Emits an event each time a webinar ends where you're the host",
  version: "0.0.3",
  dedupe: "unique", // Dedupe based on meeting ID
  props: {
    zoom,
    zoomApphook: {
      type: "$.interface.apphook",
      appProp: "zoom",
      eventNames: [
        "webinar.ended",
      ],
    },
  },
  async run(event) {
    const { payload } = event;
    const { object } = payload;
    this.$emit(
      {
        event: "webinar.ended",
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
