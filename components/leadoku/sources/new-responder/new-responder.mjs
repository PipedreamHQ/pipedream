import { axios } from "@pipedream/platform";
import leadoku from "../../leadoku.app.mjs";

export default {
  key: "leadoku-new-responder",
  name: "New Responder",
  description: "Emits a new event when there is a new responder. [See the documentation](https://help.leadoku.io/en/articles/8261580-leadoku-api-for-custom-integrations)",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    leadoku,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: 86400, // 24 hours
      },
    },
  },
  hooks: {
    async deploy() {
      const responders = await this.leadoku._makeRequest({
        path: "/newResponders",
      });
      for (const responder of responders) {
        this.$emit(responder, {
          id: responder.receiver_id,
          summary: `New Responder: ${responder.receiver_data.first_name} ${responder.receiver_data.last_name}`,
          ts: Date.parse(responder.message_scan_date),
        });
      }
    },
  },
  async run() {
    const responders = await this.leadoku._makeRequest({
      path: "/newResponders",
    });
    for (const responder of responders) {
      this.$emit(responder, {
        id: responder.receiver_id,
        summary: `New Responder: ${responder.receiver_data.first_name} ${responder.receiver_data.last_name}`,
        ts: Date.parse(responder.message_scan_date),
      });
    }
  },
};
