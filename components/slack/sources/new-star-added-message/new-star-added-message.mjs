import common from "../common/base.mjs";

export default {
  ...common,
  key: "slack-new-star-added-message",
  name: "New Star Added To Message (Instant)",
  version: "0.0.1",
  description: "Emit new event when a star is added to a message",
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
          "star_added",
        ];
      },
    },
  },
  methods: {
    ...common.methods,
    getSummary() {
      return "New star added - Message";
    },
    async processEvent(event) {
      if (event.item.type === "message") {
        return event;
      }
    },
  },
};
