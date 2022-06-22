import common from "../common/base.mjs";

export default {
  ...common,
  key: "slack-new-star-added",
  name: "New Saved Message",
  version: "0.0.1",
  description: "Emit new event when you save a message",
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
};
