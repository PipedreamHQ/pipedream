import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "rocket_chat-new-channel-created",
  name: "New Channel Created",
  description: "Emit new event when a new channel is created in RocketChat.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getResourceFn() {
      return this.rocketchat.listChannels;
    },
    getResourceType() {
      return "channels";
    },
    generateMeta(channel) {
      return {
        id: channel._id,
        summary: `New Channel: ${channel.name}`,
        ts: Date.parse(channel._updatedAt),
      };
    },
  },
  sampleEmit,
};
