import { axios } from "@pipedream/platform";
import neuronwriter from "../../neuronwriter.app.mjs";

export default {
  key: "neuronwriter-new-query-processed",
  name: "New Query Processed",
  description: "Emit new event when a query is processed by NeuronWriter API and results are ready.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    neuronwriter,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: 60,
      },
    },
  },
  methods: {
    async fetchQueries() {
      const status = "ready";
      const response = await this.neuronwriter.listQueries({
        status,
      });
      return response;
    },
    generateMeta(query) {
      const summary = `Query ${query.query} is ${query.status}`;
      return {
        id: query.query,
        summary,
        ts: Date.parse(query.updated),
      };
    },
  },
  async run() {
    const lastChecked = this.db.get("lastChecked") || new Date().toISOString();
    const queries = await this.fetchQueries();

    queries.filter((query) => {
      const queryUpdated = new Date(query.updated) > new Date(lastChecked);
      return query.status === "ready" && queryUpdated;
    }).forEach((query) => {
      this.$emit(query, this.generateMeta(query));
    });

    this.db.set("lastChecked", new Date().toISOString());
  },
};
