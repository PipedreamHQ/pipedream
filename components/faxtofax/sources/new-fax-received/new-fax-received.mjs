import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";
import faxtofax from "../../faxtofax.app.mjs";

export default {
  key: "faxtofax-new-fax-received",
  name: "New Fax Received",
  description: "Emit new event when a fax arrives on one of your numbers. [See the documentation](https://faxtofax.com/integrations/mcp)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    faxtofax,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: { intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL },
    },
  },
  hooks: {
    async deploy() {
      await this.poll(10);
    },
  },
  methods: {
    async poll(limit = 100) {
      const { faxes } = await this.faxtofax.listFaxes({
        params: {
          direction: "inbound",
          limit,
        },
      });
      const seen = this.db.get("seen") || {};
      const ready = faxes.filter((f) => true && !seen[f.fax_id]).reverse();
      for (const f of ready) {
        seen[f.fax_id] = Date.now();
        this.$emit(f, { id: f.fax_id, summary: `New fax from ${f.name || f.number} (${f.pages} page${f.pages === 1 ? "" : "s"})`, ts: Date.parse(f.completed_at || f.created_at) });
      }
      // keep the 500 most recent ids
      this.db.set("seen", Object.fromEntries(Object.entries(seen).sort((a, b) => b[1] - a[1]).slice(0, 500)));
    },
  },
  async run() {
    await this.poll();
  },
};
