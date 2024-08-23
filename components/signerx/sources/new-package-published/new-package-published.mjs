import { axios } from "@pipedream/platform";
import signerx from "../../signerx.app.mjs";

export default {
  key: "signerx-new-package-published",
  name: "New Package Published",
  description: "Emit new event when a package is published. [See the documentation]()",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    signerx,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: 60 * 15, // Poll every 15 minutes by default
      },
    },
  },
  hooks: {
    async deploy() {
      await this.signerx.emitPublishedPackages();
    },
    async activate() {
      // No webhook support, so no action needed
    },
    async deactivate() {
      // No webhook support, so no action needed
    },
  },
  async run() {
    await this.signerx.emitPublishedPackages();
  },
};
