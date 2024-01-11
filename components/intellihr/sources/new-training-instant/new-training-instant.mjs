import axios from "@pipedream/platform";
import intellihr from "../../intellihr.app.mjs";

export default {
  type: "source",
  key: "intellihr-new-training-instant",
  name: "New Training Instant",
  description: "Emits an event when a new training record is created in intellihr",
  version: "0.0.{{ts}}",
  dedupe: "unique",
  props: {
    intellihr,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: 60 * 15, // 15 minutes
      },
    },
  },
  methods: {
    generateMeta(data) {
      const {
        id, timestamp,
      } = data;
      const ts = new Date(timestamp).getTime();
      return {
        id,
        summary: `New Training Record: ${id}`,
        ts,
      };
    },
  },
  async run() {
    const url = `${this.intellihr._baseUrl()}/training`;
    const config = {
      url,
      method: "GET",
      headers: {
        Authorization: `Bearer ${this.intellihr.$auth.api_token}`,
      },
    };

    const { data } = await axios(config);
    if (Array.isArray(data)) {
      for (const record of data) {
        const meta = this.generateMeta(record);
        this.$emit(record, meta);
      }
    }
  },
};
