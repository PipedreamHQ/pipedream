import zoomAdmin from "../../zoom_admin.app.mjs";

export default {
  key: "zoom_admin-webinar-deleted",
  name: "Webinar Deleted",
  description:
    "Emits an event each time a webinar is deleted in your Zoom account",
  version: "0.1.10",
  type: "source",
  dedupe: "unique", // Dedupe based on webinar ID
  props: {
    zoomAdmin,
    zoomApphook: {
      type: "$.interface.apphook",
      appProp: "zoomAdmin",
      eventNames: [
        "webinar.deleted",
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
        summary: `Webinar ${object.topic} deleted`,
        id: object.uuid,
        ts: +new Date(object.start_time),
      },
    );
  },
};
