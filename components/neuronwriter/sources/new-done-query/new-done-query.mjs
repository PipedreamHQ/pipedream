import { axios } from "@pipedream/platform";
import neuronwriter from "../../neuronwriter.app.mjs";

export default {
  key: "neuronwriter-new-done-query",
  name: "New Done Query",
  description: "Emits an event when a query is marked as 'done', indicating content is ready for publication. [See the documentation]()",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    neuronwriter,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: 60 * 15, // 15 minutes
      },
    },
  },
  methods: {
    async fetchAndEmitQueries(status) {
      const tags = [
        "Done",
      ];
      const { data: queries } = await this.neuronwriter.listQueries({
        status,
        tags,
      });
      for (const query of queries) {
        this.$emit(query, {
          id: query.query,
          summary: `Query ID: ${query.query} marked as 'done'`,
          ts: new Date(query.updated).getTime(),
        });
      }
    },
  },
  hooks: {
    async deploy() {
      // Initial fetch for existing done queries on deploy
      await this.fetchAndEmitQueries("done");
    },
  },
  async run() {
    await this.fetchAndEmitQueries("done");
  },
};
