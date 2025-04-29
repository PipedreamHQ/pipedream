import { ChartType } from "columns-graph-model";
import { Columns } from "columns-sdk";

export default {
  type: "app",
  app: "columns_ai",
  propDefinitions: {
    name: {
      type: "string",
      label: "Graph Name",
      description: "The name of the graph",
    },
    keys: {
      type: "string[]",
      label: "Keys",
      description: "An array of keys for the data rows.",
    },
    metrics: {
      type: "string[]",
      label: "Metrics",
      description: "An array of metrics for the data rows.",
    },
    rows: {
      type: "string[]",
      label: "Rows",
      description: "An array of data objects, where each object should be a JSON string. Eg. `{ \"metric\": 4000, \"key\": \"US\", \"parent\": null }`.",
    },
  },
  methods: {
    getColumns() {
      return new Columns(this.$auth.api_key);
    },
    async createGraphFromScratch({
      keys = [], metrics = [], rows = [], chartType = ChartType.COLUMN,
    } = {}) {
      const columns = this.getColumns();
      const data = columns.data(keys, metrics, rows);
      const graph = columns.graph(data);

      graph.type = chartType;

      return graph;
    },
    async createGraphFromTemplate({
      visualId, keys = [], metrics = [], rows = [],
    } = {}) {
      const columns = this.getColumns();
      const graph = await columns.template(visualId);

      if (!graph) {
        throw new Error(`Failed to load template from Columns: ${visualId}`);
      }

      graph.data = columns.data(keys, metrics, rows);

      return graph;
    },
    publishGraph({
      name, graph,
    } = {}) {
      const columns = this.getColumns();
      return columns.publish(name, graph);
    },
  },
};
