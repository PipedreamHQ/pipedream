import heyzine from "../../heyzine.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "heyzine-new-lead",
  name: "New Lead",
  description: "Emit new event when a lead is collected from your flipbook forms",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    heyzine,
    flipbookId: {
      propDefinition: [
        heyzine,
        "flipbookId",
      ],
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
    getMeta(lead) {
      const {
        id, created,
      } = lead;
      return {
        id,
        summary: `New Lead: ${id}`,
        ts: Date.parse(created),
      };
    },
  },
  async run() {
    const lastRun = this.db.get("lastRun") || this.timer.timestamp;
    const leads = await this.heyzine.emitLeadCollectionEvent(this.flipbookId);

    for (const lead of leads) {
      if (Date.parse(lead.created) > lastRun) {
        this.$emit(lead, this.getMeta(lead));
      }
    }

    this.db.set("lastRun", this.timer.timestamp);
  },
};
