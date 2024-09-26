import base from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...base,
  key: "passcreator-new-pass-marked-voided",
  name: "New Pass Marked Voided (Instant)",
  description: "Emit new event when a pass is marked as voided. [See the documentation](https://developer.passcreator.com/space/API/23331116/Subscription+endpoint)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...base.methods,
    getEvent() {
      return "pass_voided";
    },
    generateMeta(pass) {
      return {
        id: pass.passId,
        summary: `Pass ${pass.passId} marked voided`,
        ts: Date.now(),
      };
    },
  },
  sampleEmit,
};
