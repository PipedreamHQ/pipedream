import nordigen from "../../nordigen.app.mjs";

export default {
  key: "nordigen-list-requisition-id-options",
  name: "List Requisition Id Options",
  description: "Retrieves available options for the Requisition Id field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    nordigen,
    page: {
      type: "integer",
      label: "Page",
      description: "The page of results to retrieve.",
      min: 0,
      default: 0,
    },
  },
  async run({ $ }) {
    const options = await nordigen.propDefinitions.requisitionId.options.call(this.nordigen, {
      page: this.page,
    });
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
