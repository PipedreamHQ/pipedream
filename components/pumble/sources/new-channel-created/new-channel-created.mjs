import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "pumble-new-channel-created",
  name: "New Channel Created",
  description: "Emit new event when a new channel is created in Pumble",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    generateMeta(channel) {
      return {
        id: channel.id,
        summary: `New Channel: ${channel.name}`,
        ts: Date.now(),
      };
    },
  },
  async run() {
    const channels = await this.pumble.listChannels();
    channels
      .filter(({ channel }) => channel.name)
      .forEach(({ channel }) => this.emitEvent(channel));
  },
  sampleEmit,
};
