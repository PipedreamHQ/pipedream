import {
  axios, DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
} from "@pipedream/platform";
import signerx from "../../signerx.app.mjs";

export default {
  key: "signerx-new-package-created",
  name: "New Package Created",
  description: "Emit new event when a package is newly created. [See the documentation](https://documenter.getpostman.com/view/13877745/2sa3xv9kni)",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    signerx,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
  },
  hooks: {
    async deploy() {
      await this.emitNewlyCreatedPackages();
    },
    async activate() {
      // No webhook subscription available for this API
    },
    async deactivate() {
      // No webhook subscription available for this API
    },
  },
  methods: {
    async emitNewlyCreatedPackages() {
      await this.signerx.emitNewlyCreatedPackages();
    },
  },
  async run() {
    await this.emitNewlyCreatedPackages();
  },
};
