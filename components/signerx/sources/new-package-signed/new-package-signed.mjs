import { axios } from "@pipedream/platform";
import signerx from "../../signerx.app.mjs";

export default {
  key: "signerx-new-package-signed",
  name: "New Package Signed",
  description: "Emit a new event when a package has been signed. [See the documentation]()",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    signerx,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: 60 * 15, // Poll every 15 minutes
      },
    },
  },
  methods: {
    async emitSignedPackages() {
      return this.signerx.emitSignedPackages();
    },
  },
  hooks: {
    async deploy() {
      await this.emitSignedPackages();
    },
    async activate() {
      // Hook for any activation logic
    },
    async deactivate() {
      // Hook for any deactivation logic
    },
  },
  async run() {
    await this.emitSignedPackages();
  },
};
