import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "slack-new-direct-message",
  name: "New Direct Message (Instant)",
  version: "1.0.23",
  description: "Emit new event when a message was posted in a direct message channel",
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
          "message.im",
        ];
      },
    },
    ignoreBot: {
      propDefinition: [
        common.props.slack,
        "ignoreBot",
      ],
    },
    ignoreSelf: {
      type: "boolean",
      label: "Ignore Messages from Yourself",
      description: "Ignores messages sent to yourself",
      default: false,
      optional: true,
    },
  },
  methods: {
    ...common.methods,
    getSummary() {
      return "New direct message received";
    },
    processEvent(event) {
      if ((this.ignoreSelf && event.user == this.slack.mySlackId())
        || ((this.ignoreBot) && (event.subtype === "bot_message" || event.bot_id))
        || (event.subtype === "message_changed")) {
        return;
      }
      return event;
    },
  },
  sampleEmit,
};
