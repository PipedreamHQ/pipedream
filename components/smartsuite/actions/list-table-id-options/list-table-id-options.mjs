import smartsuite from "../../smartsuite.app.mjs";

export default {
  key: "smartsuite-list-table-id-options",
  name: "List Table ID Options",
  description: "Retrieves available options for the Table ID field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    smartsuite,
    page: {
      type: "integer",
      label: "Page",
      description: "The page of results to retrieve.",
      min: 0,
      default: 0,
    },
  },
  async run({ $ }) {
    const options = await smartsuite.propDefinitions.tableId.options.call(this.smartsuite, {
      page: this.page,
    });
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
