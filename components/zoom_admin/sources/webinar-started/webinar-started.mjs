import zoomAdmin from "../../zoom_admin.app.mjs";

export default {
  key: "zoom_admin-webinar-started",
  type: "source",
  name: "Webinar Started",
  description: "Emits an event each time a webinar starts in your Zoom account",
  version: "0.1.11",
  dedupe: "unique", // Dedupe based on webinar ID
  props: {
    zoomAdmin,
    zoomApphook: {
      type: "$.interface.apphook",
      appProp: "zoomAdmin",
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
        summary: `Webinar ${object.topic} started`,
        id: object.uuid,
        ts: +new Date(object.start_time),
      },
    );
  },
};
