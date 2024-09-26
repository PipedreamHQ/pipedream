import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "rocket_chat-new-message-public-channel",
  name: "New Message in Public Channel",
  description: "Emit new event when a new message is posted to a specific public channel.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    ...common.props,
    channelId: {
      propDefinition: [
        common.props.rocketchat,
        "channelId",
      ],
    },
  },
  methods: {
    ...common.methods,
    getResourceFn() {
      return this.rocketchat.listMessages;
    },
    getParams() {
      return {
        roomId: this.channelId,
        lastUpdate: this._getLastTs(),
      };
    },
    getResourceType() {
      return "result";
    },
    getResourceSubType() {
      return "updated";
    },
    generateMeta(message) {
      return {
        id: message._id,
        summary: `New Message: ${message.msg}`,
        ts: Date.parse(message._updatedAt),
      };
    },
  },
  sampleEmit,
};
