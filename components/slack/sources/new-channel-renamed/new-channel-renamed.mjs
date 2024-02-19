import common from "../common/base.mjs";

export default {
  ...common,
  key: "slack-new-channel-renamed",
  name: "New Channel Renamed (Instant)",
  version: "0.0.1",
  description: "Emit new event when a channel is renamed.",
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
          "channel_rename",
        ];
      },
    },
  },
  methods: {
    ...common.methods,
    getSummary() {
      return "New channel renamed!";
    },
    processEvent(event) {
      return event;
    },
  },
};
