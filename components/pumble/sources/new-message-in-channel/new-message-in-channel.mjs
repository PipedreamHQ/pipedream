import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "pumble-new-message-in-channel",
  name: "New Message in Channel",
  description: "Emit new event when a message is posted in the specified channel in Pumble",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    ...common.props,
    channel: {
      propDefinition: [
        common.props.pumble,
        "channel",
      ],
    },
  },
  methods: {
    ...common.methods,
    _getLastTs() {
      return this.db.get("lastTs") || 0;
    },
    _setLastTs(lastTs) {
      this.db.set("lastTs", lastTs);
    },
    generateMeta(message) {
      return {
        id: message.id,
        summary: `New Message: ${message.text}`,
        ts: Date.parse(message.timestamp),
      };
    },
  },
  async run() {
    const lastTs = this._getLastTs();
    let maxTs = lastTs;

    const { messages } = await this.pumble.listMessages({
      params: {
        channel: this.channel,
      },
    });
    for (const message of messages) {
      const ts = Date.parse(message.timestamp);
      if (ts >= lastTs) {
        this.emitEvent(message);
        maxTs = Math.max(ts, maxTs);
      }
    }

    this._setLastTs(maxTs);
  },
  sampleEmit,
};
