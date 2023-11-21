import base from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...base,
  key: "passcreator-new-wallet-pass-created",
  name: "New Wallet Pass Created (Instant)",
  description: "Emit new event when a new wallet pass is created. [See the documentation](https://developer.passcreator.com/space/API/23331116/Subscription+endpoint)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...base.methods,
    getEvent() {
      return "pass_created";
    },
    generateMeta(pass) {
      return {
        id: pass.passId,
        summary: `New wallet pass created: ${pass.passId}`,
        ts: Date.parse(pass.createdOn),
      };
    },
  },
  sampleEmit,
};
