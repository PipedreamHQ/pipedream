import heylibby from "../../heylibby.app.mjs";
import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";
import sampleEmit from "./test-event.mjs";

export default {
  key: "heylibby-new-qualified-lead-created",
  name: "New Qualified Lead Created",
  description: "Emit new event when a new qualified lead is created.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    heylibby,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
  },
  methods: {
    _getLastTs() {
      return this.db.get("lastTs") || 0;
    },
    _setLastTs(ts) {
      this.db.set("lastTs", ts);
    },
    generateMeta(lead) {
      return {
        id: lead.id,
        summary: `New Lead ID: ${lead.id}`,
        ts: Date.parse(lead.datetime),
      };
    },
  },
  async run() {
    const lastTs = this._getLastTs();
    let maxTs = lastTs;
    const leads = await this.heylibby.listQualifiedLeads();
    if (!leads?.length) {
      return;
    }
    for (const lead of leads) {
      const ts = Date.parse(lead.datetime);
      if (ts > lastTs) {
        const meta = this.generateMeta(lead);
        this.$emit(lead, meta);
        maxTs = Math.max(maxTs, ts);
      }
    }
    this._setLastTs(maxTs);
  },
  sampleEmit,
};
