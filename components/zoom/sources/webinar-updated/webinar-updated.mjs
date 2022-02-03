import zoom from "../../zoom.app.mjs";

export default {
  key: "zoom-webinar-updated",
  name: "Webinar Updated",
  description:
    "Emits an event each time a webinar is updated where you're the host",
  version: "0.0.3",
  dedupe: "unique", // Dedupe based on meeting ID
  props: {
    zoom,
    zoomApphook: {
      type: "$.interface.apphook",
      appProp: "zoom",
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
