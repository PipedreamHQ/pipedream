import { ChartType } from "columns-graph-model";
import app from "../../columns_ai.app.mjs";
import utils from "../../common/utils.mjs";

export default {
  key: "columns_ai-build-graph-from-scratch",
  name: "Build Graph From Scratch",
  description: "Builds a graph object from scratch and publishes it. [See the documentation](https://github.com/varchar-io/vaas?tab=readme-ov-file#basic-usage)",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    app,
    name: {
      propDefinition: [
        app,
        "name",
      ],
    },
    chartType: {
      type: "string",
      label: "Chart Type",
      description: "The type of chart to construct",
      async options() {
        return [
          {
            label: "Bar",
            value: ChartType.BAR,
          },
          {
            label: "Pie",
            value: ChartType.PIE,
          },
          {
            label: "Doughnut",
            value: ChartType.DOUGHNUT,
          },
          {
            label: "Line",
            value: ChartType.LINE,
          },
          {
            label: "Area",
            value: ChartType.AREA,
          },
          {
            label: "Scatter",
            value: ChartType.SCATTER,
          },
          {
            label: "Bar Race",
            value: ChartType.BAR_RACE,
          },
          {
            label: "Boxplot",
            value: ChartType.BOXPLOT,
          },
          {
            label: "Column",
            value: ChartType.COLUMN,
          },
          {
            label: "Dot",
            value: ChartType.DOT,
          },
          {
            label: "Gauge",
            value: ChartType.GAUGE,
          },
          {
            label: "Map",
            value: ChartType.MAP,
          },
          {
            label: "Radar",
            value: ChartType.RADAR,
          },
          {
            label: "Summary",
            value: ChartType.SUMMARY,
          },
          {
            label: "Table",
            value: ChartType.TABLE,
          },
          {
            label: "Timeline",
            value: ChartType.TIMELINE,
          },
          {
            label: "Timeline Area",
            value: ChartType.TIMELINE_AREA,
          },
          {
            label: "Timeline Bar",
            value: ChartType.TIMELINE_BAR,
          },
          {
            label: "Tree",
            value: ChartType.TREE,
          },
          {
            label: "Wordcloud",
            value: ChartType.WORDCLOUD,
          },
        ];
      },
    },
    keys: {
      propDefinition: [
        app,
        "keys",
      ],
    },
    metrics: {
      propDefinition: [
        app,
        "metrics",
      ],
    },
    rows: {
      propDefinition: [
        app,
        "rows",
      ],
    },
  },
  async run({ $ }) {
    const {
      app,
      name,
      chartType,
      keys,
      metrics,
      rows,
    } = this;

    const graph = await app.createGraphFromScratch({
      chartType,
      keys,
      metrics,
      rows: utils.parseArray(rows),
    });

    const response = await app.publishGraph({
      name,
      graph,
    });

    $.export("$summary", "Successfully built and published the graph from scratch.");
    return response;
  },
};
