import common from "../common/base.mjs";

export default {
  ...common,
  key: "slack-new-direct-message",
  name: "New Direct Message",
  version: "0.0.1",
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
    ignoreMyself: {
      type: "boolean",
      label: "Ignore myself",
      description: "Ignore messages from me",
      default: true,
    },
    ignoreBot: {
      type: "boolean",
      label: "Ignore bots",
      description: "Ignore messages from bots",
      default: false,
    },
  },
  methods: {
    ...common.methods,
    processEvent(event) {
      if (this.ignoreMyself && event.user == this.mySlackId()) {
        return;
      }
      if (this.ignoreBot) {
        if (event.subtype == "bot_message" || event.bot_id) {
          return;
        }
      }
      return event;
    },
  },
};
