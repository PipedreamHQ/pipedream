import { axios } from "@pipedream/platform";
import outreach from "../../outreach.app.mjs";

export default {
  key: "outreach-new-call-instant",
  name: "New Call Instant",
  description: "Emits an event when a call is created, updated, or deleted. [See the documentation]()",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    outreach,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: 60,
      },
    },
  },
  methods: {
    ...outreach.methods,
    generateMeta(data) {
      const {
        id, attributes: { createdAt },
      } = data;
      return {
        id,
        summary: `New Call: ${id}`,
        ts: Date.parse(createdAt),
      };
    },
  },
  async run() {
    const sinceLastRun = this.db.get("sinceLastRun") || new Date().toISOString();
    const calls = await this.outreach.getCalls({
      since: sinceLastRun,
    });
    calls.forEach((call) => {
      this.$emit(call, {
        id: call.id,
        summary: `Call ${call.id} detected`,
        ts: Date.parse(call.attributes.createdAt),
      });
    });
    this.db.set("sinceLastRun", new Date().toISOString());
  },
};
