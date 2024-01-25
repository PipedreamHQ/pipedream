import agiledApp from "../../agiled.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "agiled-new-contract-created",
  name: "New Contract Created",
  description: "Emits an event when a new contract is created in Agiled. [See the documentation](https://my.agiled.app/developers)",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    agiled: {
      type: "app",
      app: "agiled",
    },
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: 60 * 15, // 15 minutes
      },
    },
  },
  methods: {
    _getCreatedAfter() {
      return this.db.get("createdAfter") || null;
    },
    _setCreatedAfter(createdAfter) {
      this.db.set("createdAfter", createdAfter);
    },
  },
  hooks: {
    async deploy() {
      const lastCreatedAt = this.db.get("lastCreatedAt") || new Date().toISOString();
      const response = await this.agiled._makeRequest({
        method: "GET",
        path: "/contracts",
        params: {
          created_at: lastCreatedAt,
        },
      });

      const contracts = response.contracts || [];
      const latestContracts = contracts.slice(-50).reverse();

      for (const contract of latestContracts) {
        this.$emit(contract, {
          id: contract.id,
          summary: `New Contract: ${contract.subject}`,
          ts: Date.parse(contract.created_at),
        });
      }

      if (contracts.length > 0) {
        const latestCreatedAt = contracts[0].created_at;
        this.db.set("lastCreatedAt", latestCreatedAt);
      }
    },
    async activate() {
      // Optionally create a webhook
    },
    async deactivate() {
      // Optionally delete a webhook
    },
  },
  async run() {
    const lastCreatedAt = this.db.get("lastCreatedAt") || new Date().toISOString();
    const response = await this.agiled._makeRequest({
      method: "GET",
      path: "/contracts",
      params: {
        created_at: lastCreatedAt,
      },
    });

    const contracts = response.contracts || [];

    if (contracts.length > 0) {
      contracts.forEach((contract) => {
        this.$emit(contract, {
          id: contract.id,
          summary: `New Contract: ${contract.subject}`,
          ts: Date.parse(contract.created_at),
        });
      });

      const latestCreatedAt = contracts[0].created_at;
      this.db.set("lastCreatedAt", latestCreatedAt);
    }
  },
};
