import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "infobip-new-viber-message-instant",
  name: "New Viber Message (Instant)",
  description: "Emit new event when a new message is received on Viber.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    ...common.props,
    resourceKey: {
      propDefinition: [
        common.props.infobip,
        "resourceKey",
        () => ({
          channel: "VIBER",
        }),
      ],
      optional: true,
    },
    resource: {
      type: "string",
      label: "Resource",
      description: "Required if `Resource Key` not present.",
      optional: true,
    },
  },
  methods: {
    ...common.methods,
    getChannel() {
      return "VIBER_BM";
    },
    getSummary(body) {
      return `New Viber message from ${body.from}: ${body.message.text}`;
    },
    getFieldName() {
      return "resource";
    },
  },
  sampleEmit,
};
