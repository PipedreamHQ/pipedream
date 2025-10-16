import zoomAdmin from "../../zoom_admin.app.mjs";

export default {
  key: "zoom_admin-webinar-updated",
  type: "source",
  name: "Webinar Updated",
  description:
    "Emits an event each time a webinar is updated in your Zoom account",
  version: "0.1.7",
  dedupe: "unique", // Dedupe based on webinar ID
  props: {
    zoomAdmin,
    zoomApphook: {
      type: "$.interface.apphook",
      appProp: "zoomAdmin",
      eventNames: [
        "webinar.updated",
      ],
    },
  },
  async run(event) {
    const { payload } = event;
    const { object } = payload;
    this.$emit(
      {
        event: "webinar.updated",
        payload,
      },
      {
        summary: `Webinar ${object.id} updated`,
        id: `${object.id}-${payload.time_stamp}`,
      },
    );
  },
};
