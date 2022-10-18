import zoom from "../../zoom.app.mjs";
import constants from "../common/constants.mjs";

export default {
  key: "zoom-custom-event",
  name: "Custom Events (Instant)",
  description: "Listen for any events tied to your Zoom user or resources you own",
  version: "0.0.6",
  type: "source",
  props: {
    zoom,
    eventNameOptions: {
      label: "Zoom Events",
      type: "string[]",
      options: constants.CUSTOM_EVENT_TYPES,
    },
    zoomApphook: {
      type: "$.interface.apphook",
      appProp: "zoom",
      async eventNames() {
        return this.eventNameOptions;
      },
    },
  },
  async run(event) {
    console.log(event);
    this.$emit(event, {
      id: event.payload?.object?.id,
      summary: event.event,
      ts: Date.now(),
    });
  },
};
