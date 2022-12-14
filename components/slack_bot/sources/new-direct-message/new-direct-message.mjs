import common from "../common/base.mjs";
import constants from "../../common/constants.mjs";

export default {
  ...common,
  key: "slack_bot-new-direct-message",
  name: "New Direct Message",
  version: "0.0.1",
  description: "Emit new event when a message was posted in a direct message channel (Bot)",
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
