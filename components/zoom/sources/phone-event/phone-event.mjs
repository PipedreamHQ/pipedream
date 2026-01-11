import common from "../common/common.mjs";
import constants from "../common/constants.mjs";

export default {
  ...common,
  key: "zoom-phone-event",
  name: "Zoom Phone Events (Instant)",
  description: "Emit new Zoom Phone event tied to your Zoom user or resources you own",
  version: "0.1.5",
  type: "source",
  props: {
    ...common.props,
    eventNameOptions: {
      type: "string[]",
      label: "Zoom Events",
      description: "Select the events you want to listen for",
      options: Object.values(constants.PHONE_EVENT_TYPES),
    },
    // eslint-disable-next-line pipedream/props-label, pipedream/props-description
    apphook: {
      type: "$.interface.apphook",
      appProp: "app",
      eventNames() {
        return this.eventNameOptions;
      },
    },
  },
  async run(event) {
    this.$emit(event, {
      id: event.payload?.object?.id,
      summary: event.event,
      ts: Date.now(),
    });
  },
};
