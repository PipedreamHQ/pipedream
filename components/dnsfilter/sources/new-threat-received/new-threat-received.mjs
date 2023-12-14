import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";
import dnsfilter from "../../dnsfilter.app.mjs";

export default {
  key: "dnsfilter-new-threat-received",
  name: "New Threat Received",
  description: "Emit new event when a user's DNS query is blocked by a policy.",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    dnsfilter,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
    organizationName: {
      propDefinition: [
        dnsfilter,
        "organizationName",
      ],
    },
    siteName: {
      propDefinition: [
        dnsfilter,
        "siteName",
      ],
    },
    policyName: {
      propDefinition: [
        dnsfilter,
        "policyName",
      ],
    },
    categoryName: {
      propDefinition: [
        dnsfilter,
        "categoryName",
      ],
    },
  },
  methods: {
    _getLastExecutionTime() {
      return this.db.get("lastExecutionTime") ?? this.timer.timestamp;
    },
    _setLastExecutionTime(lastExecutionTime) {
      this.db.set("lastExecutionTime", lastExecutionTime);
    },
  },
  hooks: {
    async deploy() {
      this._setLastExecutionTime(Date.now());
    },
  },
  async run() {
    const lastExecutionTime = this._getLastExecutionTime();
    const { logs } = await this.dnsfilter._makeRequest({
      path: `/organizations/${this.organizationName}/sites/${this.siteName}/logs`,
      method: "GET",
    });

    for (const log of logs) {
      if (log.blocked && log.timestamp > lastExecutionTime) {
        this.$emit(log, {
          id: log.id,
          summary: `New Threat: ${log.domain} blocked`,
          ts: log.timestamp,
        });
      }
    }

    this._setLastExecutionTime(Date.now());
  },
};
