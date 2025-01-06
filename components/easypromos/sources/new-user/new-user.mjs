import {
  axios, DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
} from "@pipedream/platform";
import easypromos from "../../easypromos.app.mjs";

export default {
  key: "easypromos-new-user",
  name: "New User Registration",
  description: "Emits a new event when a user registers in the promotion. [See the documentation]().",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    easypromos,
    promotionid: {
      propDefinition: [
        easypromos,
        "promotionid",
      ],
    },
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
      const lastTs = 0;
      await this.db.set("lastTs", lastTs);
      const registrations = await this.easypromos.getUsers({
        params: {
          promotion_id: this.promotionid,
          since: lastTs,
          per_page: 50,
        },
      });
      for (const registration of registrations.slice(0, 50)) {
        const ts = Date.parse(registration.created_at) || Date.now();
        this.$emit(registration, {
          id: registration.id || ts,
          summary: `New User Registration: ${registration.name}`,
          ts,
        });
      }
      if (registrations.length > 0) {
        const latestTs = Math.max(...registrations.map((r) => Date.parse(r.created_at) || 0));
        await this.db.set("lastTs", latestTs);
      }
    },
    async activate() {
      // Placeholder for activation logic if needed
    },
    async deactivate() {
      // Placeholder for deactivation logic if needed
    },
  },
  async run() {
    const lastTs = await this.db.get("lastTs") || 0;
    const registrations = await this.easypromos.getUsers({
      params: {
        promotion_id: this.promotionid,
        since: lastTs,
        per_page: 50,
      },
    });
    for (const registration of registrations) {
      const ts = Date.parse(registration.created_at) || Date.now();
      this.$emit(registration, {
        id: registration.id || ts,
        summary: `New User Registration: ${registration.name}`,
        ts,
      });
    }
    if (registrations.length > 0) {
      const latestTs = Math.max(...registrations.map((r) => Date.parse(r.created_at) || 0));
      await this.db.set("lastTs", latestTs);
    }
  },
};
