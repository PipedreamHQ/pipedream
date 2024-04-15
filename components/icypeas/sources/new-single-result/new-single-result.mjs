import { axios } from "@pipedream/platform";
import icypeas from "../../icypeas.app.mjs";

export default {
  key: "icypeas-new-single-result",
  name: "New Single Search Result",
  description: "Emit new event when a single search result comes in.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    icypeas,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: 60 * 15, // 15 minutes
      },
    },
    webhookUrl: {
      propDefinition: [
        icypeas,
        "webhookUrl",
      ],
    },
    searchInstanceId: {
      propDefinition: [
        icypeas,
        "searchInstanceId",
      ],
    },
  },
  hooks: {
    async deploy() {
      const latestResult = await this.icypeas.retrieveSingleSearchResult({
        searchInstanceId: this.searchInstanceId,
      });
      if (latestResult) {
        this.$emit(latestResult, {
          id: latestResult.id || `${Date.now()}`,
          summary: `New Result: ${latestResult.name}`,
          ts: Date.now(),
        });
      }
    },
  },
  async run() {
    const latestResult = await this.icypeas.retrieveSingleSearchResult({
      searchInstanceId: this.searchInstanceId,
    });
    if (latestResult) {
      this.$emit(latestResult, {
        id: latestResult.id || `${Date.now()}`,
        summary: `New Result: ${latestResult.name}`,
        ts: Date.now(),
      });
    }
  },
};
