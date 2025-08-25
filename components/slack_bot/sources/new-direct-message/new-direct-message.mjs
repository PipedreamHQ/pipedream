import common from "../common/base.mjs";
import constants from "../../common/constants.mjs";
import utils from "../../common/utils.mjs";

export default {
  ...common,
  key: "slack_bot-new-direct-message",
  name: "New Direct Message",
  version: "0.0.5",
  description: "Emit new event when a message is posted in a direct message channel (Bot). To open a conversation, use the Pipedream Action \"Send a Direct Message\" to send a message from the Bot, or enable direct messages to the Bot in your App Settings (Settings->App Home->Show Tabs->Messages Tab), and send a direct message to the Bot.",
  type: "source",
  dedupe: "unique",
  props: {
    ...common.props,
    channelId: {
      propDefinition: [
        common.props.app,
        "channelId",
        () => ({
          types: [
            constants.CHANNEL_TYPE.IM,
          ],
        }),
      ],
      label: "User Channel",
      description: `Events will only be emitted for direct messages between this user and the Bot. ${utils.CONVERSATION_PERMISSION_MESSAGE}`,
    },
  },
  methods: {
    ...common.methods,
    getResourceName() {
      return constants.RESOURCE_NAME.MESSAGES;
    },
    getResourceFn() {
      return this.app.conversationsHistory;
    },
    getResourceFnArgs() {
      return {
        channel: this.channelId,
        limit: constants.LIMIT,
        oldest: this.getLastTimestamp(),
        inclusive: false,
      };
    },
    generateMeta(resource) {
      return {
        id: resource.ts,
        ts: resource.ts,
        summary: `New Message Timestamp ${resource.ts}`,
      };
    },
  },
};
