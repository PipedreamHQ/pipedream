import zoom from "../../zoom.app.mjs";

export default {
  key: "zoom-webinar-deleted",
  name: "Webinar Deleted",
  description:
    "Emits an event each time a webinar is deleted where you're the host",
  version: "0.0.3",
  dedupe: "unique", // Dedupe based on meeting ID
  props: {
    zoom,
    zoomApphook: {
      type: "$.interface.apphook",
      appProp: "zoom",
      eventNames: [
        "webinar.deleted.by_me",
        "webinar.deleted.for_me",
      ],
    },
  },
  async run(event) {
    const { payload } = event;
    const { object } = payload;
    this.$emit(
      {
        event: "webinar.deleted",
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
