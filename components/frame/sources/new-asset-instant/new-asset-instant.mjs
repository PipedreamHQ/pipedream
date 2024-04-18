import common from "../common/common.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "frame-new-asset-instant",
  name: "New Asset (Instant)",
  description: "Emit new event when an asset is uploaded. [See the documentation](https://developer.frame.io/api/reference/operation/createWebhookForTeam/)",
  version: "0.0.1",
  type: "source",
  sampleEmit,
  methods: {
    ...common.methods,
    getSummary() {
      return "New Asset";
    },
    getHookData() {
      return [
        "asset.created",
      ];
    },
  },
};
