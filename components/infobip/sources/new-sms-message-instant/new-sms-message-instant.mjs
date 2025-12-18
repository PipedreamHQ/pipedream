import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "infobip-new-sms-message-instant",
  name: "New SMS Message (Instant)",
  description: "Emit new event when a new SMS message is received.",
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
          channel: "SMS",
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
      return "SMS";
    },
    getSummary(body) {
      return `New SMS from ${body.from}: ${body.text}`;
    },
  },
  sampleEmit,
};
