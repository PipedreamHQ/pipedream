import { axios } from "@pipedream/platform";
import rkvst from "../../rkvst.app.mjs";

export default {
  key: "rkvst-asset-updated",
  name: "Asset Updated",
  description: "Emits an event when an existing asset has been modified in any way on the RKVST platform. [See the documentation](https://docs.datatrails.ai/developers/api-reference/assets-api/#asset-openapi-docs)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    rkvst,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: 60 * 5, // 5 minutes
      },
    },
    assetId: {
      propDefinition: [
        rkvst,
        "assetId",
      ],
    },
    activityType: {
      propDefinition: [
        rkvst,
        "activityType",
      ],
    },
  },
  methods: {
    async fetchLatestAssetUpdate(assetId) {
      const { data } = await this.rkvst._makeRequest({
        method: "GET",
        path: `/assets/${assetId}/events`,
      });
      return data[0]; // returning the most recent event
    },
  },
  hooks: {
    async deploy() {
      // Emit events for the latest asset update at the time of deployment
      const latestUpdate = await this.fetchLatestAssetUpdate(this.assetId);
      if (latestUpdate) {
        this.$emit(latestUpdate, {
          id: latestUpdate.identity,
          summary: `Asset ID ${latestUpdate.asset_identity} updated`,
          ts: Date.parse(latestUpdate.timestamp_declared),
        });
      }
    },
  },
  async run() {
    const latestUpdate = await this.fetchLatestAssetUpdate(this.assetId);
    const lastEmittedUpdateId = this.db.get("lastEmittedUpdateId");

    if (latestUpdate && latestUpdate.identity !== lastEmittedUpdateId) {
      this.$emit(latestUpdate, {
        id: latestUpdate.identity,
        summary: `Asset ID ${latestUpdate.asset_identity} updated`,
        ts: Date.parse(latestUpdate.timestamp_declared),
      });
      this.db.set("lastEmittedUpdateId", latestUpdate.identity);
    }
  },
};
