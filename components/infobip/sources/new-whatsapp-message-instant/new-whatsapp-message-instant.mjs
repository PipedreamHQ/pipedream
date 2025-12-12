import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "infobip-new-whatsapp-message-instant",
  name: "New Whatsapp Message (Instant)",
  description: "Emit new event when a new message is received on Whatsapp.",
  version: "0.0.2",
  type: "source",
  dedupe: "unique",
  props: {
    ...common.props,
    resourceKey: {
      propDefinition: [
        common.props.infobip,
        "resourceKey",
        () => ({
          channel: "WHATSAPP",
        }),
      ],
      label: "Number Key",
      description: "Required if `Number` not present.",
      optional: true,
    },
  },
  methods: {
    ...common.methods,
    getChannel() {
      return "WHATSAPP";
    },
    getSummary(body) {
      return `New Whatsapp message from ${body.from}: ${body.message.text}`;
    },
  },
  sampleEmit,
};
