import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "slack-new-saved-message",
  name: "New Saved Message (Instant)",
  version: "0.0.1",
  description: "Emit new event when a message is saved. Note: The endpoint is marked as deprecated, and Slack might shut this off at some point down the line.",
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
      return "New saved message";
    },
  },
  sampleEmit,
};
