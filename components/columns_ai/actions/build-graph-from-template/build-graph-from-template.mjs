import app from "../../columns_ai.app.mjs";
import utils from "../../common/utils.mjs";

export default {
  key: "columns_ai-build-graph-from-template",
  name: "Build Graph From Template",
  description: "Builds a graph object from a template and publishes it. [See the documentation](https://github.com/varchar-io/vaas?tab=readme-ov-file#basic-usage).",
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
    visualId: {
      type: "string",
      label: "Visual ID",
      description: "The ID of an existing graph template on Columns. Eg. `U6tALuJ3cTdPFw` wher it can be taken from the URL `https://columns.ai/visual/view/U6tALuJ3cTdPFw`.",
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
      visualId,
      keys,
      metrics,
      rows,
    } = this;

    const graph = await app.createGraphFromTemplate({
      visualId,
      keys,
      metrics,
      rows: utils.parseArray(rows),
    });

    const response = await app.publishGraph({
      name,
      graph,
    });

    $.export("$summary", "Successfully built and published the graph from template.");
    return response;
  },
};
