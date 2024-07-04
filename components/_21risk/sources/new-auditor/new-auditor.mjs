import { axios } from "@pipedream/platform";
import _21risk from "../../_21risk.app.mjs";

export default {
  key: "_21risk-new-auditor",
  name: "New Auditor Created",
  description: "Emit new event when a new auditor is created. [See the documentation](https://api.21risk.com/)",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    _21risk,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: 60 * 15, // Poll every 15 minutes
      },
    },
  },
  methods: {
    _getLastAuditorId() {
      return this.db.get("lastAuditorId") ?? null;
    },
    _setLastAuditorId(lastAuditorId) {
      this.db.set("lastAuditorId", lastAuditorId);
    },
  },
  hooks: {
    async deploy() {
      // Emit historical events on deploy
      const auditors = await this._21risk.emitNewAuditorEvent();
      auditors.slice(0, 50).forEach((auditor) => {
        this.$emit(auditor, {
          id: auditor.id,
          summary: `New Auditor: ${auditor.name}`,
          ts: Date.parse(auditor.createdAt),
        });
      });

      if (auditors.length > 0) {
        this._setLastAuditorId(auditors[0].id);
      }
    },
    async activate() {
      // Add your activation logic if necessary
    },
    async deactivate() {
      // Add your deactivation logic if necessary
    },
  },
  async run() {
    const lastAuditorId = this._getLastAuditorId();
    const auditors = await this._21risk.emitNewAuditorEvent({
      params: {
        $filter: lastAuditorId
          ? `id gt ${lastAuditorId}`
          : undefined,
      },
    });

    auditors.forEach((auditor) => {
      this.$emit(auditor, {
        id: auditor.id,
        summary: `New Auditor: ${auditor.name}`,
        ts: Date.parse(auditor.createdAt),
      });
    });

    if (auditors.length > 0) {
      this._setLastAuditorId(auditors[0].id);
    }
  },
};
