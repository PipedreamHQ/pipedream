import chartmogul from "../../chartmogul.app.mjs";

export default {
  key: "chartmogul-list-data-source-id-options",
  name: "List Data Source UUID Options",
  description: "Retrieves available options for the Data Source UUID field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    chartmogul,
    page: {
      type: "integer",
      label: "Page",
      description: "The page of results to retrieve.",
      min: 0,
      default: 0,
    },
  },
  async run({ $ }) {
    const options = await chartmogul.propDefinitions.dataSourceId.options.call(this.chartmogul, {
      page: this.page,
    });
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
