import zoom from "../../zoom.app.mjs";

export default {
  key: "zoom-webinar-created",
  name: "Webinar Created",
  description:
    "Emits an event each time a webinar is created where you're the host",
  version: "0.0.3",
  dedupe: "unique", // Dedupe based on meeting ID
  props: {
    zoom,
    zoomApphook: {
      type: "$.interface.apphook",
      appProp: "zoom",
      eventNames: [
        "webinar.created.by_me",
        "webinar.created.for_me",
      ],
    },
  },
  async run(event) {
    const { payload } = event;
    const { object } = payload;
    this.$emit(
      {
        event: "webinar.created",
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
