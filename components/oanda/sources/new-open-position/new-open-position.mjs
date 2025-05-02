import common from "../common/base.mjs";
import md5 from "md5";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "oanda-new-open-position",
  name: "New Open Position",
  description: "Emit new event when a new open position is created or updated in an Oanda account. [See the documentation](https://developer.oanda.com/rest-live-v20/position-ep/)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    async processEvent() {
      const { positions } = await this.oanda.listOpenPositions({
        isDemo: this.isDemo,
        accountId: this.accountId,
      });

      if (!positions.length) {
        return;
      }

      positions.reverse().forEach((position) => this.emitItem(position));
    },
    generateMeta(item) {
      const hash = md5(JSON.stringify(item));
      return {
        id: hash,
        summary: `New or Updated Position for instrument ${item.instrument}`,
        ts: Date.now(),
      };
    },
  },
  sampleEmit,
};
