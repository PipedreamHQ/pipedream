import forcemanager from "../../forcemanager.app.mjs";

export default {
  key: "forcemanager-list-sales-rep-id-options",
  name: "List Sales Rep ID Options",
  description: "Retrieves available options for the Sales Rep ID field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    forcemanager,
    page: {
      type: "integer",
      label: "Page",
      description: "The page of results to retrieve.",
      min: 0,
      default: 0,
    },
  },
  async run({ $ }) {
    const options = await forcemanager.propDefinitions.salesRepId.options.call(this.forcemanager, {
      page: this.page,
    });
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
