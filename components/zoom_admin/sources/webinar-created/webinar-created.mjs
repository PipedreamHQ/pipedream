import zoomAdmin from "../../zoom_admin.app.mjs";

export default {
  key: "zoom_admin-webinar-created",
  type: "source",
  name: "Webinar Created",
  description:
    "Emits an event each time a webinar is created in your Zoom account",
  version: "0.1.9",
  dedupe: "unique", // Dedupe based on webinar ID
  props: {
    zoomAdmin,
    zoomApphook: {
      type: "$.interface.apphook",
      appProp: "zoomAdmin",
      eventNames: [
        "webinar.created",
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
        summary: `Webinar ${object.topic} created`,
        id: object.uuid,
        ts: +new Date(object.start_time),
      },
    );
  },
};
