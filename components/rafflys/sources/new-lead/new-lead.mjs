import rafflys from "../../rafflys.app.mjs";
import {
  axios, DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
} from "@pipedream/platform";

export default {
  key: "rafflys-new-lead",
  name: "New Lead",
  description: "Emits a new event when a lead is collected. [See the documentation](https://u.pcloud.link/publink/show?code=xzkxycvzu287tqvvofjiax2ydcirlbaedpw7)",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    rafflys,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
  },
  methods: {
    _getAfter() {
      return this.db.get("after") ?? null;
    },
    _setAfter(after) {
      this.db.set("after", after);
    },
  },
  hooks: {
    async deploy() {
      // Fetch the most recent leads to set the initial state
      const leads = await this.rafflys._makeRequest({
        path: "/leads",
        params: {
          after: this._getAfter(),
        },
      });

      // Store the most recent lead timestamp
      if (leads.length) {
        const after = leads[0].timestamp;
        this._setAfter(after);
      }

      // Emit up to 50 of the most recent leads
      for (const lead of leads.slice(0, 50).reverse()) {
        this.$emit(lead, {
          id: lead.id,
          summary: `New Lead: ${lead.email}`,
          ts: Date.parse(lead.timestamp),
        });
      }
    },
  },
  async run() {
    // Fetch new leads since the last run
    const leads = await this.rafflys._makeRequest({
      path: "/leads",
      params: {
        after: this._getAfter(),
      },
    });

    // Emit new leads and store the most recent timestamp
    for (const lead of leads) {
      this.$emit(lead, {
        id: lead.id,
        summary: `New Lead: ${lead.email}`,
        ts: Date.parse(lead.timestamp),
      });
    }

    if (leads.length) {
      const latestAfter = leads[0].timestamp;
      this._setAfter(latestAfter);
    }
  },
};
