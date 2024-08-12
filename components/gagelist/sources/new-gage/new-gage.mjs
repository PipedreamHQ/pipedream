import { axios } from "@pipedream/platform";
import gagelist from "../../gagelist.app.mjs";

export default {
  key: "gagelist-new-gage",
  name: "New Gage Created",
  description: "Emits an event each time a new gage is created",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    gagelist,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: 60 * 15, // 15 minutes
      },
    },
  },
  methods: {
    _getCursor() {
      return this.db.get("cursor") || null;
    },
    _setCursor(cursor) {
      this.db.set("cursor", cursor);
    },
    generateMeta(data) {
      const {
        id, created_at, name,
      } = data;
      return {
        id,
        summary: `New Gage: ${name}`,
        ts: Date.parse(created_at),
      };
    },
  },
  async run() {
    const since = this.db.get("since");

    const params = since
      ? {
        since,
      }
      : {};
    const results = await this.gagelist.getGages(params);

    for (const result of results) {
      this.$emit(result, this.generateMeta(result));
    }

    if (results.length > 0) {
      const lastResult = results[results.length - 1];
      this.db.set("since", lastResult.created_at);
    }
  },
};
