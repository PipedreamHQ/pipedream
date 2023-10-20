import common from "../common/base.mjs";
import constants from "../../common/constants.mjs";

export default {
  ...common,
  key: "slack_bot-new-message-in-channel",
  name: "New Message In Channel",
  version: "0.0.2",
  description: "Emit new event when a new message is posted to a public, private or group channel (Bot)",
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
            constants.CHANNEL_TYPE.PUBLIC,
            constants.CHANNEL_TYPE.PRIVATE,
            constants.CHANNEL_TYPE.MPIM,
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
