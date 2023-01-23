import zoomAdmin from "../../zoom_admin.app.mjs";

export default {
  key: "zoom_admin-webinar-ended",
  type: "source",
  name: "Webinar Ended",
  description: "Emits an event each time a webinar ends in your Zoom account",
  version: "0.0.4",
  dedupe: "unique", // Dedupe based on webinar ID
  props: {
    zoomAdmin,
    zoomApphook: {
      type: "$.interface.apphook",
      appProp: "zoomAdmin",
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
        summary: `Webinar ${object.topic} ended`,
        id: object.uuid,
        ts: +new Date(object.start_time),
      },
    );
  },
};
