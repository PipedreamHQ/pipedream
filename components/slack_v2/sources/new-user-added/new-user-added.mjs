import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "slack_v2-new-user-added",
  name: "New User Added (Instant)",
  version: "0.0.5",
  description: "Emit new event when a new member joins a workspace.",
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
          "team_join",
        ];
      },
    },
  },
  methods: {
    ...common.methods,
    getSummary({ user: { name } }) {
      return `New User: ${name}`;
    },
  },
  sampleEmit,
};
