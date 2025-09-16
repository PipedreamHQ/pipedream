import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

const slack = {
  ...common.props.slack,
  reloadProps: true,
};

export default {
  ...common,
  key: "slack_v2_test-new-direct-message",
  name: "New Direct Message (Instant)",
  version: "1.0.27",
  description: "Emit new event when a message was posted in a direct message channel",
  type: "source",
  dedupe: "unique",
  props: {
    ...common.props,
    /* eslint-disable-next-line pipedream/props-description,pipedream/props-label */
    slack,
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
        slack,
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
  async additionalProps() {
    const { response_metadata: { scopes } } = await this.slack.authTest({
      throwRateLimitError: true,
    });
    if (!scopes.includes("im:history")) {
      return {
        alert: {
          type: "alert",
          alertType: "warning",
          content: "The Slack account connected does not have the `im:history` scope. Events will only be emitted for direct messages with the Bot.",
        },
      };
    }
    return {};
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
