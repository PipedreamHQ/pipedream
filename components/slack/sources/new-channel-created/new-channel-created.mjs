import common from "../common/base.mjs";

export default {
  ...common,
  key: "slack-new-channel-created",
  name: "New Channel Created (Instant)",
  version: "0.0.1",
  description: "Emit new event when a new channel is created.",
  type: "source",
  dedupe: "unique",
  props: {
    ...common.props,
    // eslint-disable-next-line pipedream/props-description,pipedream/props-label
    slackApphook: {
      type: "$.interface.apphook",
      appProp: "slack",
      async eventNames() {
        return [
          "channel_created",
        ];
      },
    },
  },
  methods: {
    ...common.methods,
    getSummary() {
      return "New channel created!";
    },
    processEvent(event) {
      return event;
    },
  },
};
